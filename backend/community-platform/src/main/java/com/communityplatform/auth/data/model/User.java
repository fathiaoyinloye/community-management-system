package com.communityplatform.auth.data.model;

import com.communityplatform.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@SuperBuilder
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {

    @Column(name = "community_id")
    private UUID communityId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String username;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean accountSetupCompleted;

    @Column(nullable = false)
    private int tokenVersion = 0;


    @Column(unique = true)
    private String activationToken;

    private LocalDateTime activationTokenExpiry;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }


    @Override
    public String getUsername() {
        return username;
    }



    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
