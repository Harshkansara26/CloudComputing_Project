## CloudComputing_Project

* The application will help address a real-world business problem that happens within the back-office processes of companies/organizations. 
Many companies have sales representatives that visit potential clients or major conferences, trade shows/seminars, where they meet potential clients,
they collect information about these potential clients through means of conversation and physical documents. To-date the business card is still 
considered as a major mean of introductions. Despite all the technological advancements, business cards are still irreplaceable. It seems that no amount 
of automation is going to take their place. Accordingly many companies use business cards to build a “Leads contact datastore”  or “Potential contact
datastore”; and have either dedicated teams in the backoffice, or if they are small, require their sales representatives to enter the potential customer 
information into the datastore.
* The information is then used for targeted marketing and to establish/maintain the relationships. The inputting of this information is a time consuming 
and tedious job, not to mention that it requires and full stack IT infrastructure. Luckily, the advancements of OCR technology, cloud computing services 
and AI web capabilities in the fields of NLP and image recognition can make this task easier.
Over the course of six weeks each team will research, design, build and test a serverless web-based application. The application is to make the task of 
populating the “Leads contact store” on the cloud much easier, by intelligently detecting the potential contact information from the business card. 
The teams will research and use the technologies mentioned under the technology stack section.

* Technology stack:
Programming language backend: Python 
Programming language frontend: Any frontend framework that supports RESTful architecture. 
Data storage: aws S3, DynamoDB
Software development toolkit: aws Boto3
Serverless framework: aws chalice
Testing: local host 
Operating system: Linux
AI services: aws recognition or aws Textract the team needs to decide which to use or use both. Aws comprehend and aws medical comprehend, again the team needs to decide which to useor use both.
Architecture: RESTful api , function as a service (FaaS) 

* 2.	App requirements:
a.	User should be able to load an image of the business card to the system and the solution should detect the following:
i.	Name
ii.	Telephone number (s)
iii.	Email address
iv.	Company website
v.	Company address
b.	For elements detected the user should be allowed to update the elements before they are stored into a DynamoDB table which will act as  the “Leads contact” datastore. (“Human in the loop”)
c.	Retrieval: User should be able to retrieve data from the “Leads contact datastore” by lead name.
