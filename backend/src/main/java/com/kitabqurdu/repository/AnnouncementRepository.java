package com.kitabqurdu.repository;

import com.kitabqurdu.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    List<Announcement> findByActiveTrue();
    
    List<Announcement> findByActiveTrueAndExpiresAtAfter(LocalDateTime now);
}
