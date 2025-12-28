package com.kitabqurdu.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }
    
    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    @Async
    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        Context context = new Context();
        context.setVariables(variables);
        
        String htmlContent = templateEngine.process(templateName, context);
        sendEmail(to, subject, htmlContent);
    }
    
    @Async
    public void sendWelcomeEmail(String to, String username) {
        String subject = "Welcome to KitabQurdu!";
        String body = String.format(
            "<html><body>" +
            "<h2>Welcome to KitabQurdu, %s!</h2>" +
            "<p>Thank you for joining our second-hand book marketplace.</p>" +
            "<p>Start exploring and listing books today!</p>" +
            "<p>Best regards,<br/>The KitabQurdu Team</p>" +
            "</body></html>",
            username
        );
        sendEmail(to, subject, body);
    }
    
    @Async
    public void sendPasswordResetEmail(String to, String resetToken) {
        String subject = "Reset Your Password - KitabQurdu";
        String body = String.format(
            "<html><body>" +
            "<h2>Password Reset Request</h2>" +
            "<p>Click the link below to reset your password:</p>" +
            "<p><a href='http://localhost:4200/reset-password?token=%s'>Reset Password</a></p>" +
            "<p>This link will expire in 1 hour.</p>" +
            "<p>If you didn't request this, please ignore this email.</p>" +
            "</body></html>",
            resetToken
        );
        sendEmail(to, subject, body);
    }
    
    @Async
    public void sendNewPostNotification(String to, String postTitle, String authorName) {
        String subject = "New Book Match - KitabQurdu";
        String body = String.format(
            "<html><body>" +
            "<h2>New Book Listing Matches Your Filters!</h2>" +
            "<p>A new book has been listed that matches your saved search:</p>" +
            "<p><strong>%s</strong> by %s</p>" +
            "<p><a href='http://localhost:4200/posts'>View All Posts</a></p>" +
            "</body></html>",
            postTitle, authorName
        );
        sendEmail(to, subject, body);
    }
}
