# Week 2 (25.1. - 31.1.) tasks


### Henna:
Put together functional user stories as Gitlab issues. Made a UI design with Figma and started to code frontend with React and Chakra UI.

### Paavo:
Set up the back- and frontend projects for the MERN app of our solution. Updated the gitlab-ci.yml file to reflect the correct container, 
for automatic deployment. Started some premilinary work for the backend/server structure and development. Did the conatainer configuration
for the MERN app.

### Otso:
Looking into and learning the selected stacks parts, done Express and react exersies, Weekly meetings on monday with team and on tuesday with mentor

### Pierre:
Did the OWASP security considerations.

### OWASP security considerations

Using OWASP Zap, we found 12 security alerts. 2 of them are in the OWASP top ten :

##### A03:2021-Injection
Our web application isn’t protected from data injection attacks as we didn’t set the content-security-policy header. 

##### A05:2021-Security Misconfiguration 
Web browser data loading may be possible, due to a Cross Origin Resource Sharing (CORS) misconfiguration on the web server


We chose 3 other security risks of the top ten that we will address each week :

##### A06:2021-Vulnerable and Outdated Components
This security breach appears when the developpers use outdated versions of an exploitation system or an outdated database manager for exemple. To prevent this from happening, we all update our work environment and we download our components from reliable websites.

##### A02:2021-Cryptographic Failures
The confidential data that we use must be encrypted, when we store it but also when transmit it.

##### A07:2021-Identification and Authentication Failures
We have to implement a system to block for a period of time, the users who enter the wrong password several time. This can prevent brute force attacks.
