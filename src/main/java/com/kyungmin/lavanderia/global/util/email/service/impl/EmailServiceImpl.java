package com.kyungmin.lavanderia.global.util.email.service.impl;

import com.kyungmin.lavanderia.global.util.email.service.EmailService;
import com.kyungmin.lavanderia.member.exception.EmailAuthenticationFailedEx;
import com.kyungmin.lavanderia.member.exception.EmailSendFailedEx;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final JavaMailSender javaMailSender;

    // 회원가입 이메일 전송
    @Override
    public void sendSignupCode(String email) {

        String randomNumber = Integer.toString((int) ((Math.random() * 900000) + 100000)); // 100000에서 999999 사이의 숫자 생성
        String subject = "하루세탁 회원가입 이메일 인증";
        String text = loadEmailTemplate(randomNumber);

        String redisKey = "Email Authentication Code, Member Email : " + email;
        redisTemplate.opsForValue().set(redisKey, randomNumber, 5, TimeUnit.MINUTES);
        System.out.println("전송 redisKey : " + redisKey);
        System.out.println("전송 randomNumber : " + randomNumber);

        sendEmailUtil(email, subject, text);
    }

    // 회원가입 이메일 인증
    @Override
    public void checkSignupCode(String email, String token) {
        try {
            String redisKey = "Email Authentication Code, Member Email : " + email;

            String getToken = (String) redisTemplate.opsForValue().get(redisKey);

            if (getToken != null && getToken.equals(token)) {
                redisTemplate.delete(redisKey);
            } else {
                throw new EmailAuthenticationFailedEx(email);
            }
        }catch (RuntimeException e){
            throw new RuntimeException(email + " : Email Authentication Code is not found");
        }

    }

    // 이메일 전송
    public void sendEmailUtil(String email, String subject, String text){
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());
            mimeMessageHelper.setTo(email); // 메일 수신자
            mimeMessageHelper.setSubject(subject); // 메일 제목
            mimeMessageHelper.setText(text, true); // 메일 본문 내용
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new EmailSendFailedEx(email);
        }
    }

    // 이메일 인증 url을 포함한 이메일 템플릿을 로드
    private String loadEmailTemplate(String randomNumber) {
        try {
            ClassPathResource resource = new ClassPathResource("/static/verification-email.html");
            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            return String.format(template, randomNumber);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load email template", e);
        }
    }
}


