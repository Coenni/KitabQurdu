package com.kitabqurdu.repository;

import com.kitabqurdu.model.SavedFilter;
import com.kitabqurdu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedFilterRepository extends JpaRepository<SavedFilter, Long> {
    
    List<SavedFilter> findByUser(User user);
    
    List<SavedFilter> findByNotificationEnabledTrue();
}
