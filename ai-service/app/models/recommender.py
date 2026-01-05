import pandas as pd
from surprise import SVD, Dataset, Reader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.database import get_engine

class HybridRecommender:
    def __init__(self):
        self.engine = get_engine()
        # Lấy dữ liệu sản phẩm cho Content-based
        self.products = pd.read_sql("SELECT id, name, category FROM products", self.engine)
        self._prepare_content_filter()

    def _prepare_content_filter(self):
        tfidf = TfidfVectorizer(stop_words='english')
        self.products['content'] = self.products['name'] + " " + self.products['category']
        tfidf_matrix = tfidf.fit_transform(self.products['content'])
        self.cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    def get_recommendations(self, user_id):
        query = """
            SELECT user_id, product_id, 
            SUM(CASE WHEN action_type='ORDER' THEN 12 WHEN action_type='CART' THEN 5 ELSE 1 END) as rating
            FROM (
                -- Nếu shop_visits chưa có user_id, hãy tạm thời bỏ qua hoặc dùng 0 (nhưng sẽ không cá nhân hóa được)
                -- SELECT user_id, product_id, 'VISIT' as action_type FROM shop_visits WHERE user_id IS NOT NULL
                
                -- Tập trung vào dữ liệu từ giỏ hàng và đơn hàng (đã có user_id)
                SELECT user_id, product_id, 'CART' as action_type FROM cart_items WHERE user_id IS NOT NULL
                UNION ALL
                SELECT o.user_id, oi.product_id, 'ORDER' as action_type 
                FROM order_items oi 
                JOIN orders o ON oi.order_id = o.id
            ) as combined GROUP BY user_id, product_id
        """
        df = pd.read_sql(query, self.engine)
        
        reader = Reader(rating_scale=(1, 12))
        data = Dataset.load_from_df(df[['user_id', 'product_id', 'rating']], reader)
        algo = SVD()
        algo.fit(data.build_full_trainset())

        # Tính toán điểm số dự đoán
        all_ids = self.products['id'].tolist()
        self.products['score'] = [algo.predict(user_id, pid).est for pid in all_ids]
        
        return self.products.sort_values('score', ascending=False).head(12)['id'].tolist()
    
    def get_system_wide_trending(self, limit=10):
        """
        Lấy xu hướng sản phẩm dựa trên số lượng bán ra của toàn bộ hệ thống.
        """
        try:
            # Truy vấn lấy các sản phẩm được mua nhiều nhất
            query = """
                SELECT product_id, COUNT(*) as sales_count 
                FROM order_items 
                GROUP BY product_id 
                ORDER BY sales_count DESC 
                LIMIT %s
            """
            df = pd.read_sql(query, self.engine, params=(limit,))
            
            if df.empty:
                return []
                
            return df['product_id'].tolist()
        except Exception as e:
            print(f"Lỗi lấy xu hướng hệ thống: {e}")
            return []
    
    def get_similar_products(self, product_id):
        try:
            # Sử dụng self.engine hợp lệ để đọc dữ liệu
            df = pd.read_sql("SELECT id, name, category FROM products", self.engine)
            
            if df.empty or product_id not in df['id'].values:
                return []

            # Logic xử lý TF-IDF và Cosine Similarity
            df['content'] = df['name'].fillna('') + " " + df['category'].fillna('')
            tfidf = TfidfVectorizer(stop_words='english')
            tfidf_matrix = tfidf.fit_transform(df['content'])
            
            cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
            
            # Lấy vị trí sản phẩm
            idx = df.index[df['id'] == product_id][0]
            sim_scores = list(enumerate(cosine_sim[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            
            # Trả về 6 ID sản phẩm tương đồng nhất
            similar_indices = [i[0] for i in sim_scores[1:7]]
            return df.iloc[similar_indices]['id'].tolist()
            
        except Exception as e:
            print(f"Lỗi AI Logic: {str(e)}") # Log lỗi chi tiết để debug
            return []