# ScrappyNews

This application uses express, express-handlebars, body-parser, mongoose, axios, and cheerio
to scrape article information from the NPR website.  It provides article references for the
user to peruse - it provides a teaser statement regarding each article as well as a link to
allow the user to see the entire article.

Unfortunately, at time of this release, the desired functionality for the project is not
complete.  I hope to add more functionlity but at present time I am lacking the ability
for the user to add notes to each article.

A few notes regarding functionality.. I got a bit hung up on understanding the assignment.
I do believe I did the wrong things but it wasn't until late that I realized this.  I had
set up the app to scrape the articles and save them to the MongoDB and continue from there.
It was in the continuing part where I realized I had structured things wrong.  It seems 
like the articles were supposed to be presented to the user and they could select which
ones to select.  Then, guessing on the next "scrape" we would search for new articles,
present the saved articles followed by all the new ones.  A complexity I had not considered.

Regarding the notes.. I got hung up on the other functionality and just didn't get to the
notes.  Regardless of the assignment, I am planning to do this over the weekend as it seems
like a very good skill to have.

Pseudo code for the adding of the notes will begin with adding a button to each note for
adding a note.  Pop up a mechanism to allow them to enter text and then save the note to
the note table in the database.  The relationship for the rows is already setup.

Thanks for your time,
Ken