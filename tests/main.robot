*** Settings ***
Library    Browser

*** Variables ***
${URL}          http://materialistic-insect.surge.sh
${EMAIL}        jvalanen@gmail.com
${PASSWORD}     asdf

*** Test Cases ***
Test Login and Verify Alert
    Open Browser    ${URL}    chromium
    Set Viewport Size    1920    1080
    Fill Text    id=email    ${EMAIL}
    Fill Text    id=password    ${PASSWORD}
    Click    css=button[type="submit"]
    Handle Future Dialogs    accept
    Close Browser
