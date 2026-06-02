package com.project.shopapp.services.newsletter;

import com.project.shopapp.dtos.NewsletterDTO;
import com.project.shopapp.models.NewsletterSubscriber;
import com.project.shopapp.repositories.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NewsletterService {
    private final NewsletterSubscriberRepository newsletterSubscriberRepository;

    /**
     * Subscribe an email. Idempotent: returns false if the email was already subscribed.
     */
    public boolean subscribe(NewsletterDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();
        if (newsletterSubscriberRepository.existsByEmail(email)) {
            return false;
        }
        newsletterSubscriberRepository.save(
                NewsletterSubscriber.builder()
                        .email(email)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
        return true;
    }
}
