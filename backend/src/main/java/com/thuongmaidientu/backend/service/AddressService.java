package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.entity.Address;
import com.thuongmaidientu.backend.entity.User;
import com.thuongmaidientu.backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public Address getDefaultAddress() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            Long userId = ((User) principal).getId();
            return addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .orElse(null);
        }
        return null;
    }
}