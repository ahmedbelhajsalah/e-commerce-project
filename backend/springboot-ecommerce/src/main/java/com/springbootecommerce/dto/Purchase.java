package com.springbootecommerce.dto;

import com.springbootecommerce.entity.Address;
import com.springbootecommerce.entity.Customer;
import com.springbootecommerce.entity.Order;
import com.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
