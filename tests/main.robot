*** Settings ***
Library    Browser

*** Variables ***
${BASE_URL}     %{BASE_URL}   # TODO: Default to http://localhost:5173 if not defined?
${AUTO_USER_EMAIL}    %{AUTO_USER_EMAIL}
${CONFIRMED_USER_EMAIL}    %{CONFIRMED_USER_EMAIL}
${EXISTING_EMAIL}    %{EMAIL}
${PASSWORD}     Password1234%

*** Test Cases ***
Test Login and Verify Alert
    New Browser  headless=True
    New Page  ${BASE_URL}
    Fill Text    id=email    ${EXISTING_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[data-test-id="signInOrUpSubmit"]
    ${error_text}=    Get Text    data-test-id=errorMessage
    Should Be Equal    ${error_text}    Sign in failed: NotAuthorizedException: Incorrect username or password.
    Close Browser

Test Sign up and Make API Request
    New Browser  headless=True
    New Page  ${BASE_URL}
    Click    css=button[data-test-id="signInOrUpToggle"]
    Fill Text    id=email    ${AUTO_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Fill Text    id=confirmPassword    ${PASSWORD}
    Click    css=button[data-test-id="signInOrUpSubmit"]
    Sleep  1
    Click    css=button[data-test-id="signInOrUpSubmit"]
    Click    css=button[data-test-id="makeApiRequest"]
    Close Browser

Test Sign up and User Not Confirmed
    New Browser  headless=True
    New Page  ${BASE_URL}
    Click    css=button[data-test-id="signInOrUpToggle"]
    Fill Text    id=email    ${CONFIRMED_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Fill Text    id=confirmPassword    ${PASSWORD}
    Click    css=button[data-test-id="signInOrUpSubmit"]
    Sleep  1
    Click    css=button[data-test-id="signInOrUpSubmit"]
    ${error_text}=    Get Text    data-test-id=errorMessage
    Should Be Equal    ${error_text}    Sign in failed: UserNotConfirmedException: User is not confirmed.
    Close Browser
