package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.TestItem;
import com.sms.smsbackend.repository.TestItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private TestItemRepository repo;

    @GetMapping
    public String hello() {
        return "Backend is working!";
    }
    @GetMapping("/api/secure")
    public String securedRoute() {
        return "✅ You accessed a protected route!";
    }


    @PostMapping
    public String createSample() {
        TestItem item = new TestItem();
        item.setName("Zakaria Sample");
        repo.save(item);
        return "Sample saved to MongoDB!";
    }
}
