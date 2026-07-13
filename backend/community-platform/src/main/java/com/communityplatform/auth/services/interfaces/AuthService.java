package com.communityplatform.auth.services.interfaces;

import com.communityplatform.auth.dto.request.LoginRequest;
import com.communityplatform.auth.dto.response.LoginResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request, HttpServletResponse response);

    void logout(HttpServletResponse response);


}
