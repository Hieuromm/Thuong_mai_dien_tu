import pandas as pd
from prophet import Prophet

class TrendForecaster:
    def __init__(self, engine):
        self.engine = engine

    def predict_all_trends(self):
        # 1. Lấy danh sách danh mục duy nhất từ bảng products
        categories_df = pd.read_sql("SELECT DISTINCT category FROM products", self.engine)
        categories = categories_df['category'].tolist()
        
        results = {}

        for cat in categories:
            try:
                # 2. Truy vấn dữ liệu: Join orders để lấy ngày created_at
                query = f"""
                    SELECT DATE(o.created_at) as ds, COUNT(*) as y 
                    FROM order_items oi 
                    JOIN orders o ON oi.order_id = o.id
                    JOIN products p ON oi.product_id = p.id
                    WHERE p.category = '{cat}'
                    GROUP BY ds
                """
                df = pd.read_sql(query, self.engine)

                # 3. KIỂM TRA ĐIỀU KIỆN: Nếu thiếu dữ liệu thì BỎ QUA
                if df.empty or len(df) < 5:
                    results[cat] = "NEW" 
                    continue 

                # 4. Huấn luyện mô hình Prophet cho danh mục đủ điều kiện
                model = Prophet(daily_seasonality=True)
                model.fit(df)
                
                future = model.make_future_dataframe(periods=7)
                forecast = model.predict(future)
                
                # So sánh giá trị dự báo để xác định xu hướng
                is_increasing = forecast['yhat'].iloc[-1] > forecast['yhat'].iloc[-8]
                results[cat] = "TĂNG" if is_increasing else "GIẢM"

            except Exception as e:
                print(f"Lỗi tại danh mục {cat}: {str(e)}")
                results[cat] = "ERROR"
                continue

        return results