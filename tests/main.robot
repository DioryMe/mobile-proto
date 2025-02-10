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
    Sleep    4

    Go To  ${BASE_URL}
    Sleep  2
    Click    css=li[data-test-id="room-selection-item-native"]
    Sleep  6
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

Import Diory via ImportTestForm
    New Browser  headless=True
    New Page  ${BASE_URL}
    Fill Text    id=email    ${AUTO_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[data-test-id="signInSubmit"]

    Go To    ${BASE_URL}/endpoint-test
    # Fill & submit the form
    # - currently using default values)
    # Fill Text    id=parentDioryId    /
    # Fill Text    id=destinationRoomId    native
    Upload File By Selector   id=formFiles     ${CURDIR}/BangBang.png
    Click    css=button[data-test-id="submitImportTestForm"]
    Sleep   5
    ${response_text}=    Get Text    css=div[data-test-id=response-import]
    Should Contain    ${response_text}    Diory imported successfully

    Go To  ${BASE_URL}
    Sleep  2
    Click    css=li[data-test-id="room-selection-item-native"]
    Sleep  6
    Click   css=div[data-test-id="diory-link-bafkreif4lt3vhlmxpcey4xooxlsoebpwfdwtflfwfru7d2meai2fb236eu"]
    Sleep  10
    ${element}    Get Element    css=div[data-test-id="content"]
    Should Not Be Equal    ${element}    None

    Close Browser

Copy Diory via CopyTestForm
    New Browser  headless=False
    New Page  ${BASE_URL}
    Fill Text    id=email    ${AUTO_USER_EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[data-test-id="signInSubmit"]

    Go To    ${BASE_URL}/endpoint-test
    # Fill & submit the form
    # - currently using default values)
    # Fill Text    id=sourceRoomId    demo
    # Fill Text    id=copyDioryId    generic-content
    # Fill Text    id=destinationRoomId    native
    # Fill Text    id=parentDioryId    /
    Click    css=button[data-test-id="submitCopyTestForm"]
    Sleep   5
    ${response_text}=    Get Text    css=div[data-test-id=response-copy]
    Should Contain    ${response_text}    Diory copied successfully

    # Check that it is copied
    Go To  ${BASE_URL}
    Sleep  2
    Click    css=li[data-test-id="room-selection-item-native"]
    Sleep  6
    ${diory_link_text}=    Get Text    css=div[data-test-id="diory-link-generic-content"]
    Should Be Equal    ${diory_link_text}  Generic content

    # Click the link diory
    Click  css=div[data-test-id="diory-link-generic-content"]
    Sleep  2
    ${diory_heading}=    Get Text    css=div[data-test-id="diory-heading-generic-content"]
    Should Be Equal    ${diory_heading}   Generic content

    Close Browser
