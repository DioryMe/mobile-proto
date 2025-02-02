*** Settings ***
Library    Browser

*** Variables ***
${BASE_URL}     %{BASE_URL}   # TODO: Default to http://localhost:5173 if not defined?
${AUTO_USER_EMAIL}    %{AUTO_USER_EMAIL}
${NON_CONFIRMED_EMAIL}    %{NON_CONFIRMED_EMAIL}
${EXISTING_EMAIL}    %{EXISTING_EMAIL}
${PASSWORD}     Password1234%

*** Test Cases ***
User with wrong password: "Incorrect username or password" error
# uses already existing user's email with wrong password
    New Browser  headless=True
    New Page  ${BASE_URL}
    Fill Text    id=email    ${EXISTING_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[data-test-id="signInSubmit"]
    ${error_text}=    Get Text    data-test-id=errorMessage
    Should Be Equal    ${error_text}    Sign in failed: NotAuthorizedException: Incorrect username or password.
    Close Browser

Complete sign up and login flow for new user: checks demo & native rooms
# uses email which gets auto-confirmed
    New Browser  headless=True
    New Page  ${BASE_URL}
    Click    css=button[data-test-id="signInOrUpToggle"]
    Fill Text    id=email    ${AUTO_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Fill Text    id=confirmPassword    ${PASSWORD}
    Click    css=button[data-test-id="signUpSubmit"]
    Click    css=button[data-test-id="signInSubmit"]
    ${demo_item}=    Get Text    data-test-id=room-selection-item-demo
    Should Be Equal    ${demo_item}    DEMO
    ${native_item}=    Get Text    data-test-id=room-selection-item-native
    Should Be Equal    ${native_item}    NATIVE
    ${diory_heading}=    Get Text    data-test-id=diory-heading-/
    Should Be Equal    ${diory_heading}    Diory demo content

    Go To  ${BASE_URL}/endpoint-test
    Click    css=button[data-test-id="nativeDiographInitButton"]
    Sleep    2

    Go To  ${BASE_URL}
    Sleep  0.5
    Click    css=li[data-test-id="room-selection-item-native"]
    Sleep  2
    ${diory_heading}=    Get Text    css=div[data-test-id="diory-heading-/"]
    Should Be Equal    ${diory_heading}  ${AUTO_USER_EMAIL}

    Close Browser


Sign up and login flow for non-confirmed user: "User is not confirmed" error
# uses email which doesn't get auto-confirmed, needs to be confirmed manually
    New Browser  headless=True
    New Page  ${BASE_URL}
    Click    css=button[data-test-id="signInOrUpToggle"]
    Fill Text    id=email    ${NON_CONFIRMED_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Fill Text    id=confirmPassword    ${PASSWORD}
    Click    css=button[data-test-id="signUpSubmit"]
    # To prevent flakiness as signup button doesn't always to sign in button and gets clicked twice
    # Sleep  2
    Click    css=button[data-test-id="signInSubmit"]
    ${error_text}=    Get Text    data-test-id=errorMessage
    Should Be Equal    ${error_text}    Sign in failed: UserNotConfirmedException: User is not confirmed.
    Close Browser
