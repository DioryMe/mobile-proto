*** Settings ***
Library    Browser

*** Variables ***
${BASE_URL}     %{BASE_URL}   # TODO: Default to http://localhost:5173 if not defined?
${EMAIL}        jvalanen@gmail.com
${PASSWORD}     asdf

*** Test Cases ***
Test Login and Verify Alert
    Open Browser    ${BASE_URL}    chromium    headless=True
    Set Viewport Size    1920    1080
    Fill Text    id=email    ${EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[type="submit"]
    ${error_text}=    Get Text    data-test-id=errorMessage
    Should Be Equal    ${error_text}    Sign in failed: NotAuthorizedException: Incorrect username or password.

    Close Browser
