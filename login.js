// Configuration for Azure AD login
const msalConfig = {
    auth: {
        clientId: "9a7b828a-12ea-474e-a2c3-dc13e94d1330", // Replace with your Azure AD client ID
        authority: "https://login.microsoftonline.com/90f3f200-a8e1-42dc-947a-65f9fc0cd0b4", // Replace with your Azure AD tenant ID
        redirectUri: "https://jasonshy.github.io/seeker/"
}
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// When the login button is clicked, start the login process
document.getElementById("login-btn").addEventListener("click", async () => {
    console.log("Login button clicked!");  // This will log to the console when the button is clicked.
    msalInstance.loginRedirect({ scopes: ["User.Read"] });  // Scopes define the level of access needed
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // You could log or use the username/password for custom logic
    console.log("Username:", username);
    console.log("Password:", password); // Note: Don't store or process passwords directly for security reasons

    try {
        // Start the Azure login redirect process
        await msalInstance.loginRedirect({ scopes: ["User.Read"] });
    } catch (error) {
        console.error("Login failed:", error);
    }
});
