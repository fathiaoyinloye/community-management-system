package com.communityplatform.auth.services.interfaces;

import com.communityplatform.auth.dto.request.CompleteAccountSetupRequest;
import com.communityplatform.auth.dto.request.CreatePendingUserRequest;
import com.communityplatform.auth.dto.response.AccountActivatedResponse;
import com.communityplatform.auth.dto.response.UserActivationResponse;

public interface UserService {

    UserActivationResponse createPendingUser(CreatePendingUserRequest request);
    AccountActivatedResponse completeAccountSetup(CompleteAccountSetupRequest request);


}
