package com.project.shopapp.configurations;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${CLOUDINARY_URL:}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudinaryUrl == null || cloudinaryUrl.isBlank()) {
            // Fall back to dummy instance when no Cloudinary URL is configured (local dev)
            return new Cloudinary();
        }
        return new Cloudinary(cloudinaryUrl);
    }
}
