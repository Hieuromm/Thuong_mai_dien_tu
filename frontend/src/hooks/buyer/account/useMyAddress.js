import { useState, useEffect } from 'react';
import { getAddressAPI, addAddressAPI, deleteAddressAPI, setDefaultAddressAPI } from '../../../services/addressService';

export const useMyAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = async () => {
        try {
            const data = await getAddressAPI();
            setAddresses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // Thêm địa chỉ
    const addAddress = async (formData) => {
        try {
            await addAddressAPI(formData);
            alert("Thêm địa chỉ thành công");
            fetchAddresses();
            return true;
        } catch (error) {
            alert("Lỗi thêm địa chỉ");
            return false;
        }
    };

    const deleteAddress = async (id) => {
        if(window.confirm("Bạn chắc chắn muốn xóa?")) {
            await deleteAddressAPI(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
        }
    };

    const setDefaultAddress = async (id) => {
        await setDefaultAddressAPI(id);
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    };

    return { addresses, loading, addAddress, deleteAddress, setDefaultAddress };
};