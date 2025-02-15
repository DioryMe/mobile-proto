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

Non-confirmed user: "User is not confirmed" error
# uses email which doesn't get auto-confirmed, needs to be confirmed manually
    New Browser  headless=True
    New Page  ${BASE_URL}
    Click    css=button[data-test-id="signInOrUpToggle"]
    Fill Text    id=email    ${NON_CONFIRMED_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Fill Text    id=confirmPassword    ${PASSWORD}
    Click    css=button[data-test-id="signUpSubmit"]
    Click    css=button[data-test-id="signInSubmit"]
    ${error_text}=    Get Text    data-test-id=errorMessage
    Should Be Equal    ${error_text}    Sign in failed: UserNotConfirmedException: User is not confirmed.
    Close Browser

Successful sign up and login
# uses email which gets auto-confirmed
    New Browser  headless=False
    New Page  ${BASE_URL}
    Click    css=button[data-test-id="signInOrUpToggle"]
    Fill Text    id=email    ${AUTO_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Fill Text    id=confirmPassword    ${PASSWORD}
    Click    css=button[data-test-id="signUpSubmit"]
    Click    css=button[data-test-id="signInSubmit"]
    Sleep    2

    # Init
    Go To  ${BASE_URL}/endpoint-test
    Click    css=button[data-test-id="nativeDiographInitButton"]
    Sleep    2

    # Demo room
    Go To  ${BASE_URL}/browse
    ${diory_heading}=    Get Text    data-test-id=diory-heading-/
    Should Be Equal    ${diory_heading}    Diory demo content

    # Native room
    Go To  ${BASE_URL}/home
    Sleep  6
    ${diory_heading}=    Get Text    css=div[data-test-id="diory-heading-/"]
    Should Be Equal    ${diory_heading}  ${AUTO_USER_EMAIL}

    Close Browser

Import Diory via ImportTestForm
    New Browser  headless=True
    New Page  ${BASE_URL}
    Fill Text    id=email    ${AUTO_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[data-test-id="signInSubmit"]
    Sleep  2

    Go To  ${BASE_URL}/add
    Upload File By Selector   id=formFiles     ${CURDIR}/PIXNIO-53551-1782x1188.jpeg
    Click    css=button[data-test-id="submitImportTestForm"]
    Sleep   7
    # ${response_text}=    Get Text    css=div[data-test-id=response-import]
    # Should Contain    ${response_text}    Diory imported successfully

    # Check imported diory from My Diory
    # Go To  ${BASE_URL}
    Click   css=button[data-test-id="diory-link-bafkreif4lt3vhlmxpcey4xooxlsoebpwfdwtflfwfru7d2meai2fb236eu"]
    Click    css=div[data-test-id="content"]
    ${response_text}=    Get Text    css=div[data-test-id=no-content-available]
    Should Contain    ${response_text}    No content available

    Close Browser

Copy Diory via CopyTestForm
    New Browser  headless=True
    New Page  ${BASE_URL}
    Fill Text    id=email    ${AUTO_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[data-test-id="signInSubmit"]
    Sleep  2

    Go To  ${BASE_URL}/copy
    Click    css=button[data-test-id="submitCopyTestForm"]
    Sleep   7
    # ${response_text}=    Get Text    css=div[data-test-id=response-copy]
    # Should Contain    ${response_text}    Diory copied successfully

    # Check copied diory from My Diory
    # Go To  ${BASE_URL}
    ${diory_link_text}=    Get Text    css=button[data-test-id="diory-link-generic-content"]
    Should Be Equal    ${diory_link_text}  Generic content

    # Click the link diory
    Click  css=button[data-test-id="diory-link-generic-content"]
    Sleep  2
    ${diory_heading}=    Get Text    css=div[data-test-id="diory-heading-generic-content"]
    Should Be Equal    ${diory_heading}   Generic content

    Close Browser
