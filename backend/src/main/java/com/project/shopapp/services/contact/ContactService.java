package com.project.shopapp.services.contact;

import com.project.shopapp.dtos.ContactMessageDTO;
import com.project.shopapp.models.ContactMessage;
import com.project.shopapp.repositories.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactMessageRepository contactMessageRepository;

    public ContactMessage createContactMessage(ContactMessageDTO dto) {
        ContactMessage contactMessage = ContactMessage.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .subject(dto.getSubject())
                .message(dto.getMessage())
                .createdAt(LocalDateTime.now())
                .build();
        return contactMessageRepository.save(contactMessage);
    }
}
