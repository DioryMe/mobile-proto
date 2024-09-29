*** Settings ***
Library    Browser

*** Variables ***
${PROD_URL}     http://materialistic-insect.surge.sh
${LOCAL_URL}    http://localhost:5173
${EMAIL}        jvalanen@gmail.com
${PASSWORD}     asdf

*** Test Cases ***
Test Login and Verify Alert
    Open Browser    ${PROD_URL}    chromium    headless=True
    Set Viewport Size    1920    1080
    Fill Text    id=email    ${EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[type="submit"]
    Handle Future Dialogs    accept
    Close Browser

Test Login and Verify Alert
    Open Browser    ${LOCAL_URL}    chromium    headless=True
    Set Viewport Size    1920    1080
    Fill Text    id=email    ${EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[type="submit"]
    Handle Future Dialogs    accept
    Close Browser
