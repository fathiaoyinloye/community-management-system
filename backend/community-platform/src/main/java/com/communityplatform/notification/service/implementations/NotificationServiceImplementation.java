package com.communityplatform.notification.service.implementations;

import com.communityplatform.notification.service.interfaces.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationServiceImplementation implements NotificationService {
    @Override
    public void notifyResident(String contact, String message) {
        // Mocked for demo — logs instead of sending a real email/SMS
        log.info("MOCK NOTIFICATION to {}: {}", contact, message);
    }
}
