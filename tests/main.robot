*** Settings ***
Library    Browser

*** Variables ***
${BASE_URL}     %{BASE_URL}   # TODO: Default to http://localhost:5173 if not defined?
${AUTO_USER_EMAIL}    %{AUTO_USER_EMAIL}
${NON_CONFIRMED_EMAIL}    %{NON_CONFIRMED_EMAIL}
${EXISTING_EMAIL}    %{EXISTING_EMAIL}
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

# Test Sign up and Make API Request
#     New Browser  headless=True
#     New Page  ${BASE_URL}
#     Click    css=button[data-test-id="signInOrUpToggle"]
#     Fill Text    id=email    ${AUTO_USER_EMAIL}
#     Fill Text    id=password    ${PASSWORD}
#     Fill Text    id=confirmPassword    ${PASSWORD}
#     Click    css=button[data-test-id="signInOrUpSubmit"]
#     Sleep  2
#     Click    css=button[data-test-id="signInOrUpSubmit"]

#     # Tää menee uusiksi
#     Click    css=button[data-test-id="makeApiRequest"]
#     ${dioryText}=  Get Text   css=div#diory-1
#     Should Be Equal  ${dioryText}  Do something nice for someone you care about
#     ${count}=    Get Element Count    css=div[data-test-id=diory-list] > *
#     Should Be Equal As Numbers    ${count}    30

#     Close Browser

Test Sign up and User Not Confirmed
    New Browser  headless=True
    New Page  ${BASE_URL}
    Click    css=button[data-test-id="signInOrUpToggle"]
    Fill Text    id=email    ${NON_CONFIRMED_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Fill Text    id=confirmPassword    ${PASSWORD}
    Click    css=button[data-test-id="signInOrUpSubmit"]
    Sleep  1
    Click    css=button[data-test-id="signInOrUpSubmit"]
    ${error_text}=    Get Text    data-test-id=errorMessage
    Should Be Equal    ${error_text}    Sign in failed: UserNotConfirmedException: User is not confirmed.
    Close Browser
