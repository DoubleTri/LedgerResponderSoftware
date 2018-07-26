Ledger Responder Software is a React based web application for specialty Fire, Police, and EMS teams.  

It's built to keep all administration and communion for the team in one location.  It fixes the problem team administrators had with keeping track for member participation, cost recovery calculations, training schedules, etc.  

This repo has all available components that were built.  When a team asks for a web application they are asked which of the components they need, then a personalized application is made specifically for them.   

The components and their functionality include...


<b>Certificate Uploads</b>

  Each member has the ability to upload a photo of their certificates

<b>Team Blog</b>

  A basic CRUD blog

<b>Training/Events calendar </b>

  An editable FullCalendar component 

<b>Equipment Sign Out Logs</b>

  If a team member needs to borrow a piece of equipment for class or training, they may log it out with this component with tracks times when and who took the equipment and when it was returned. 

<b>Group Email </b>
  
  A NodeMailer component used with Firebase Functions.  This allows team members to email the whole team or smaller portions of it and have reply emails sent to the sender's personal email. 

<b>Report Writing</b>

  All data needed to complete a report can be entered, logged, and edited here.  This includes the ability to upload photos of the scene. 

<b>Cost Recovery Calculations</b>

  This component takes the cost recovery policy for the team and auto calculates a final cost recovery amount to to billed out to the responsible party.  This algorithm is customizable based on the team's policy and preference.  It has the ability to look at attendance for an incident, the skill levels of each team member (based on their profile data), time spent on scene, and equipment used, and calculate a final cost automatically.  This data can then be dowloaded to a pdf and sent to the responsible party for collection. 

<b>Team Policy and Procedures Uploads and Storage</b>

  Teams my upload pdf files of their policy and easily reference them from this component.  Extra effort was made to make this component very easy to use and read on mobile devices as often times members need to reference policy on scene and not from a desktop. 

<b>Member Activity Calculations</b>

  This component iterates through all generated rosters and calculates each member's participation percentage. 

<b>Event Rosters</b>

  Team members may create and edit rosters for events, trainings, and call outs. 

<b>Truck Check </b>

  A basic truck check/equipment log that's stored in a data base.  A team member doing a truck check is prompted with the notes from the last logged check making it easier to find errors in equipment and patterns of out of service items. 

<b>Member Profile Editing</b>

  Based on what a team may want, this gives each member the ability to add contact data, emergency contact data, certifications, and training levels for various disciplines.   

<b>--- HazMat Spacific --- </b>

<b>Business Material Storage Log</b>

  Local Businesses can be given a login for the web app.  They will only be able to access their information and nothing else in the app or database.  They can log any hazardous material, its location in the building, and its quantity.  This can then be seen by hazmat team members for easy reference and better response.  

<b>Equipment Calibration Log/Reminder</b>

  Most hazmat equipment needs calibration at specific intervals.  This component allows members to log individual equipment and its calibration interval and be automatically emailed 7 days prior to that equipment's calibration date. 
