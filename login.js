// Configuration for Azure AD login
const msalConfig = {
    auth: {
        clientId: "9a7b828a-12ea-474e-a2c3-dc13e94d1330", // Your Azure AD client ID
        authority: "https://login.microsoftonline.com/90f3f200-a8e1-42dc-947a-65f9fc0cd0b4", // Your Azure AD tenant ID
        redirectUri: "https://jasonshy.github.io/seeker/edit.html" // Your redirect URI
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// When the login button is clicked, start the login process
document.getElementById("login-btn").addEventListener("click", () => {
    console.log("Login button clicked!");
    
    // Start the Azure login redirect process
    msalInstance.loginRedirect({ scopes: ["User.Read"] });  // Scopes define the level of access needed
});

// After the redirect, handle the login response
msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
        console.log("Login successful:", response);
        
        // Store user information in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(response.account));

        // Redirect to another page after login
        window.location.href = "add-data.html";  // Change this to your desired page after login
    }
}).catch((error) => {
    console.error("Login failed:", error);  // Log any errors during the login process
});
