/* MySQL Config Settings */
-- SHOW VARIABLES LIKE 'sql_mode';
-- To enable MySQL strict mode: set global sql_mode='STRICT_TRANS_TABLES';
-- To disable MySQL strict mode: set global sql_mode='';
-- SET FOREIGN_KEY_CHECKS=1;  /* Where value 0 == turns off foreign key field check, and 1 turns on the foreign key field check. */

-- Lists all referenced (children) tables of provided referenced_table_name (parent) tables.
-- SELECT table_name FROM information_schema.KEY_COLUMN_USAGE WHERE table_schema = 'KnowledgeStitcher' AND referenced_table_name = 'Categories';
-- SELECT table_name FROM information_schema.KEY_COLUMN_USAGE WHERE table_schema = 'KnowledgeStitcher' AND referenced_table_name = 'Stamps';

/* Creating and Using KS Database */
-- CREATE DATABASE KnowledgeStitcher;
-- SHOW DATABASES;
USE KnowledgeStitcher;
-- SHOW TABLES;

/* Selects For All Records in Tables */
/*
	SELECT * FROM Users; 
    SELECT * FROM Tickets; 
    SELECT * FROM Artifacts; 
    SELECT * FROM Stamps;
    SELECT * FROM Categories;
    SELECT * FROM Tags;
    SELECT * FROM Stamps_Categories_Bridge;
    SELECT * FROM Categories_Tags_Bridge;
    SELECT * FROM Stamps_Categories_Tags_Bridge;
    SELECT * FROM Sessions;
    
*/

/* Drops all Tables */
/*
    DROP TABLE Users; 
    DROP TABLE Tickets; 
    DROP TABLE Artifacts; 
    DROP TABLE Stamps;
    DROP TABLE Categories;
    DROP TABLE Tags;
    DROP TABLE Stamps_Categories_Bridge;
    DROP TABLE Categories_Tags_Bridge;
    DROP TABLE Stamps_Categories_Tags_Bridge;
    DROP TABLE Sessions;
*/

/* Users Table */
CREATE TABLE IF NOT EXISTS Users (
	userID INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username NVARCHAR(255) NOT NULL,
    userPassword NVARCHAR(255) NOT NULL,
    isAdmin BOOL NOT NULL
);

-- DESCRIBE Users;
-- SELECT * FROM Users;
/*
INSERT INTO Users (username, userPassword, isAdmin) VALUES ('testUser1', 'testUser1', 0);
INSERT INTO Users (username, userPassword, isAdmin) VALUES ('testAdmin1', 'testAdmin1', 1);
INSERT INTO Users (username, userPassword, isAdmin) VALUES ('testAdmin2', 'testAdmin2', 1);

INSERT INTO Users (username, userPassword, isAdmin) VALUES ('testAdmin3', SHA1('testAdmin3'), 1);

INSERT INTO Users (username, userPassword, isAdmin) VALUES ('admin@email.ks.edu', SHA1('password'), 1);
INSERT INTO Users (username, userPassword, isAdmin) VALUES ('student@email.ks.edu', SHA1('password'), 0);


UPDATE Users SET `username` = 'testUser3', `userPassword` = 'testUser3', `isAdmin` = 0 WHERE `userID` = 3;
*/

/* Tickets Table */
CREATE TABLE IF NOT EXISTS Tickets (
	ticketID INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID INT,
    datePlaced DATETIME,
    userSearchQuery NVARCHAR(1000)
);

-- DESCRIBE Tickets;
-- SELECT * FROM Tickets;
/*
INSERT INTO Tickets (userID, datePlaced, userSearchQuery) VALUES (1, '2022-07-22 15:07:00', 'SOH CAH TOA2');
INSERT INTO Tickets (userID, datePlaced, userSearchQuery) VALUES (5, '2022-07-22 15:07:00', '[{"field":"Artifacts.title","input":"Test Input","condition":"AND"}]');

DELETE FROM Tickets WHERE ticketID = 2;
*/

/* Artifacts Table */
CREATE TABLE IF NOT EXISTS Artifacts (
	artifactID INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID INT UNSIGNED NOT NULL,
    title NVARCHAR(255) NOT NULL,
    descr NVARCHAR(250000) NOT NULL,
    author NVARCHAR(255) NOT NULL,
    formatType ENUM('Link', '.MP3', '.MP4', '.TXT', '.PDF', '.DOCX', '.PNG', 'OTHER') NOT NULL,
    location NVARCHAR(500) NOT NULL   
);

-- DESCRIBE Artifacts;
-- DROP TABLE Artifacts;
-- SELECT * FROM Artifacts;
-- SELECT * FROM Artifacts WHERE title LIKE '%Pythagorean%'
-- SELECT * FROM Artifacts WHERE descr LIKE '%Pythagorean%';
-- SELECT * FROM `Artifacts` WHERE `title` LIKE 'Pythagorean Theorem' OR `descr` LIKE 'Pythagorean Theorem'
-- SELECT * FROM `Artifacts` WHERE `title` LIKE '%Pythagorean Theorem%' OR `descr` LIKE '%Pythagorean Theorem%'

-- SELECT * FROM 'Artifacts' WHERE Artifacts.title LIKE 'Pythagorean Theorem' AND Artifacts.formatType LIKE '.MP4'

-- DELETE FROM Artifacts WHERE artifactID = 18

/*
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Pythagorean Theorem', 'YouTube Video Test', 'Khan Academy', 'Link', 'https://www.youtube.com/embed/AA6RfgP-AHU?start=356');
    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Pythagorean Theorem', 'MP4 Video Test', 'Khan Academy', '.MP4', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/Khan+Academy+Pythagorean+Theorem.mp4#t=356');
    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Pythagorean Theorem', 'Image PNG Test', 'Khan Academy', '.PNG', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanImage.png');
    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Pythagorean Theorem', 'PDF Test', 'Khan Academy', '.PDF', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Pythagorean Theorem', 'Pythagorean Theorem', 'Khan Academy', '.PDF', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Pythagorean Theorem', 'Test Pythagorean Theorem Test', 'Khan Academy', '.PDF', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Test Pythagorean Theorem Test', 'Pythagorean Theorem', 'Khan Academy', '.PDF', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Test Pythagorean Theorem Test', 'Test Pythagorean Theorem Test', 'Khan Academy', '.PDF', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(5, 'Testing testAdmin2 UserID For Sessions AND Pythagorean Theorem', 'Test Pythagorean Theorem Test', 'Khan Academy', '.PDF', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'YouTube Link Artifact Test', 'Test Pythagorean Theorem Test', 'UnknownAuthor', 'Link', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Theorem', 'Testing Theorem Input for correlated searches', 'UnknownAuthor', 'Link', 'https://se425-ks-proof-of-concepts.s3.amazonaws.com/KhanAcademyPythagoreanTheoremDistanceFormula.pdf#page=2');
    
INSERT INTO Artifacts (userID, title, descr, author, formatType, location) VALUES 
	(1, 'Basic trigonometry', 'Trigonometry on Khan Academy: Big, fancy word, right? Do not be fooled. Looking at the prefix, tri-, you could probably assume that trigonometry (trig as it is sometimes called) has something to do with triangles. You would be right! Trig is the study of the properties of triangles. Why is it important? It is used in measuring precise distances, particularly in industries like satellite systems and sciences like astronomy. It is not only space, however. Trig is present in architecture and music, too. Now you may wonder...how is knowing the measurement and properties of triangles relevant to music?? THAT is a great question. Maybe you will learn the answer from us in these tutorials!', 'Khan Academy', 'Link', 'https://www.youtube.com/watch?v=Jsiy4TxgIME');
    
*/

/* Stamps Table */
CREATE TABLE IF NOT EXISTS Stamps (
	stampID INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    artifactID INT UNSIGNED NOT NULL,
    aTimestamp TIME,
    pageNumber INT UNSIGNED,
    sectionPercentage NVARCHAR(255),
    shortName NVARCHAR(100) NOT NULL,
    views INT,
    thumbsUpCount INT,
    thumbsDownCount INT,
    isFlagged BOOL,
    FOREIGN KEY (artifactID) 
		REFERENCES Artifacts(artifactID) 
		ON DELETE CASCADE
);

-- DESCRIBE Stamps;
-- SELECT * FROM Stamps;
-- SELECT * FROM `Stamps` WHERE `artifactID` = 1 OR `artifactID` = 2
/*
INSERT INTO Stamps (artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) VALUES 
	(1, '00:05:53', NULL, NULL, '', 0, 0, 0, 0);
INSERT INTO Stamps (artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) VALUES 
	(1, '00:05:53', NULL, NULL, '', 0, 0, 0, 0);
INSERT INTO Stamps (artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) VALUES 
	(5, NULL, 10, NULL, 'shortNameTest', 22, 5, 5, 0);
INSERT INTO Stamps (artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) VALUES 
	(3, NULL, NULL, NULL, 'shortNameTest', 22, 5, 5, 0);
    
INSERT INTO Stamps (artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) VALUES 
	(1, '00:00:00', NULL, NULL, 'Basic Right Triangle', 0, 0, 0, 0);    
INSERT INTO Stamps (artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) VALUES 
	(1, '00:02:00', NULL, NULL, 'Basic Trig Functions', 0, 0, 0, 1);    


UPDATE Stamps SET views = 20 WHERE stampID = 7;
UPDATE Stamps SET aTimeStamp = '00:07:15' WHERE stampID = 7;
UPDATE Stamps SET isFlagged = 0 WHERE stampID = 7;
UPDATE Stamps SET shortName = 'UpdateTest' WHERE stampID = 7;

Update Stamps SET thumbsUpCount = 20 WHERE stampID = 1;
Update Stamps SET thumbsUpCount = 3 WHERE stampID = 2;
Update Stamps SET thumbsUpCount = 15 WHERE stampID = 3;
Update Stamps SET thumbsUpCount = 57 WHERE stampID = 4;
Update Stamps SET thumbsUpCount = 7 WHERE stampID = 5;



DELETE FROM Stamps WHERE stampID = 9;
*/

/* Categories Table */
CREATE TABLE IF NOT EXISTS Categories (
	catID INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    catLabel NVARCHAR(50) NOT NULL
);

-- DESCRIBE Categories;
-- SELECT * FROM Categories;
/*
INSERT INTO Categories (catLabel) VALUES ('Geometry');
INSERT INTO Categories (catLabel) VALUES ('Trigonometry');
INSERT INTO Categories (catLabel) VALUES ('Trigonometry3'); SELECT LAST_INSERT_ID();
INSERT INTO Categories (catLabel) VALUES ('Calc');

INSERT INTO Categories (catLabel) VALUES ('Trigonometry');

DELETE FROM Categories WHERE catID = 14;
*/

/* Tags Table */
CREATE TABLE IF NOT EXISTS Tags (
	tagID INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    tagLabel NVARCHAR(50) NOT NULL
);

-- DESCRIBE Tags;
-- SELECT * FROM Tags;
/*
INSERT INTO Tags (tagLabel) VALUES ('A^2 + B^2 = C^2');
INSERT INTO Tags (tagLabel) VALUES ('SOHCAHTOA');
INSERT INTO Tags (tagLabel) VALUES ("d/dx(fg) = fg' + gf'");
INSERT INTO Tags (tagLabel) VALUES ("3-4-5");

INSERT INTO Tags (tagLabel) VALUES ("Right Triangle");
INSERT INTO Tags (tagLabel) VALUES ("Triangle");
INSERT INTO Tags (tagLabel) VALUES ("3-4-5");
INSERT INTO Tags (tagLabel) VALUES ("Pythagorean Theorem");
INSERT INTO Tags (tagLabel) VALUES ("90degrees");
INSERT INTO Tags (tagLabel) VALUES ("Hypotenuse");


DELETE FROM Tags WHERE tagID = 5;
*/

/* Stamps & Categories Bridge Table */
CREATE TABLE IF NOT EXISTS Stamps_Categories_Bridge(
	stampID INT UNSIGNED NOT NULL,
	catID INT UNSIGNED NOT NULL,    
    PRIMARY KEY (stampID, catID),
	FOREIGN KEY (stampID) 
		REFERENCES Stamps(stampID) 
		ON DELETE CASCADE,
	FOREIGN KEY (catID) 
		REFERENCES Categories(catID) 
		ON DELETE CASCADE
);

-- DESCRIBE Stamps_Categories_Bridge;
-- DROP TABLE Stamps_Categories_Bridge;
-- SELECT * FROM Stamps_Categories_Bridge;
/*
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (3, 2);
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (3, 4);
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (6, 5);
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (7, 4);
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (7, 5);
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (7, 19);
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (7, 13);

INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (15, 2);
INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (15, 4);

INSERT INTO Stamps_Categories_Bridge (stampID, catID) VALUES (1, 1);

*/


/* Categories & Tags Bridge Table */
CREATE TABLE IF NOT EXISTS Categories_Tags_Bridge(
	catID INT UNSIGNED NOT NULL,
	tagID INT UNSIGNED NOT NULL,    
    PRIMARY KEY (catID, tagID),
	FOREIGN KEY (catID) 
		REFERENCES Categories(catID) 
		ON DELETE CASCADE, 
    FOREIGN KEY (tagID) 
		REFERENCES Tags(tagID) 
		ON DELETE CASCADE  
);

-- DESCRIBE Categories_Tags_Bridge;
-- DROP TABLE Categories_Tags_Bridge;
-- SELECT * FROM Categories_Tags_Bridge;
/*
INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (2, 1);
INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (2, 3);
INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (5, 4);
INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (5, 5);
INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (5, 1);
INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (5, 3);

INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (20, 10);
INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (20, 3);

INSERT INTO Categories_Tags_Bridge (catID, tagID) VALUES (1, 1);

*/

/* Stamps_Categories_Tags_Bridge Table */
CREATE TABLE IF NOT EXISTS Stamps_Categories_Tags_Bridge (
	stampID INT UNSIGNED NOT NULL,
    catID INT UNSIGNED NOT NULL,
    tagID INT UNSIGNED NOT NULL,
    PRIMARY KEY (stampID, catID, tagID),
    FOREIGN KEY (stampID)
		REFERENCES Stamps(stampID)
        ON DELETE CASCADE,
    FOREIGN KEY (catID) 
		REFERENCES Categories(catID)
        ON DELETE CASCADE,
    FOREIGN KEY (tagID) 
		REFERENCES Tags(tagID) 
		ON DELETE CASCADE
);

-- DESCRIBE Stamps_Categories_Tags_Bridge;
-- DROP TABLE Stamps_Categories_Tags_Bridge;
-- SELECT * FROM Stamps_Categories_Tags_Bridge;
/*
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (3, 2, 1);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (3, 2, 3);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (3, 2, 4);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (7, 4, 5);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (7, 5, 1);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (7, 5, 3);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (7, 20, 3);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (7, 20, 10);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (10, 13, 8);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (11, 13, 8);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (12, 13, 8);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (13, 13, 8);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (14, 13, 8);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (7, 13, 8);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (7, 13, 10);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (15, 2, 1);
INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (15, 4, 4);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (26, 4, 12);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (16, 2, 1);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (35, 4, 1);

INSERT INTO Stamps_Categories_Tags_Bridge (stampID, catID, tagID) VALUES (1, 1, 1);

DELETE FROM Stamps_Categories_Tags_Bridge WHERE catID = 5 AND tagID = 5;
*/

/* Sessions Table */
CREATE TABLE IF NOT EXISTS Sessions (
	userID INT UNSIGNED NOT NULL,
    stampID INT UNSIGNED NOT NULL,
    lastAccessedDate DATETIME,
    duration INT,
    hasThumbUp BOOL,
    hasThumbDown BOOL,
    PRIMARY KEY (userID, stampID),
    FOREIGN KEY (stampID)
		REFERENCES Stamps(stampID)
        ON DELETE CASCADE
);

-- DESCRIBE Sessions;
-- DROP TABLE Sessions;
-- SELECT * FROM Sessions;
/* Attempting to add a foreign key constraint 
ALTER TABLE Sessions
	ADD CONSTRAINT `DeleteSessionsOnStampParentDelete`
	FOREIGN KEY (stampID) 
		REFERENCES Stamps(stampID) 
		ON DELETE CASCADE;
*/
/*
INSERT INTO Sessions (userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown) VALUES (1, 3, '2022-07-25 07:59:30', '180', 1, 0);
INSERT INTO Sessions (userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown) VALUES (1, 5, '2021-09-05 14:32:00', '570', 1, 0);
INSERT INTO Sessions (userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown) VALUES (2, 7, '2021-09-05 14:32:00', '570', 1, 0);

INSERT INTO Sessions (userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown) VALUES (5, 5, '2022-09-05 14:32:00', '570', 0, 0);
INSERT INTO Sessions (userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown) VALUES (2, 15, '2022-09-05 14:32:00', '570', 0, 0);
INSERT INTO Sessions (userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown) VALUES (2, 12, '2022-09-05 14:32:00', '570', 0, 0);

*/




/* Complex SQL Calls */
/*
	// Returns artifacts with stamps first, then non-stamped artifacts second:
    SELECT * FROM Artifacts 
		LEFT JOIN Stamps
			ON Artifacts.artifactID = Stamps.artifactID
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
	// Returns artifacts with stamps first, then non-stamped artifacts second based on title and description search values:
	SELECT * FROM Artifacts 
		LEFT JOIN Stamps
			ON Artifacts.artifactID = Stamps.artifactID
		WHERE `title` LIKE '%Pythagorean Theorem%' OR `descr` LIKE '%Pythagorean Theorem%'
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;	
        
	SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		WHERE `title` LIKE '%Pythagorean Theorem%' OR `descr` LIKE '%Pythagorean Theorem%' 
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
        
	--------
    
    
    // Returns artifacts with stamps and associated categories first, then non-stamped artifacts second (without associations to categories or tags):
    SELECT * FROM Artifacts 
		LEFT JOIN Stamps
			ON Artifacts.artifactID = Stamps.artifactID
		LEFT JOIN Categories
			ON Artifacts.artifactID
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
	
    	
            
	--------------
    
    // Returns a list of artifacts and associated stamps (Part 1).
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		WHERE `title` LIKE '%Pythagorean Theorem%'
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
	// Returning all associated categories of a stamp (Part 2).
    SELECT stampID, catID, catLabel FROM (
		SELECT * FROM (
			SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps
				INNER JOIN Stamps_Categories_Bridge
					ON Stamps.stampID = Stamps_Categories_Bridge.stampID
					WHERE Stamps.stampID = 3
		) AS St_Cat_BridgeAssociations 
			INNER JOIN Categories
				ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID
	) AS St_Cat_Bridge_CategoriesAssociations
    
    
    // Returning all associated tags of a category (Part 3).
    SELECT catID, tagID, tagLabel FROM (
		SELECT * FROM (
			SELECT Categories.catID, Categories_Tags_Bridge.tagID AS TagIDFromBridge FROM Categories
				INNER JOIN Categories_Tags_Bridge
					ON Categories.catID = Categories_Tags_Bridge.catID
					WHERE Categories.catID = 2
		) AS Cat_Tag_BridgeAssociations 
			INNER JOIN Tags
				ON Cat_Tag_BridgeAssociations.TagIDFromBridge = Tags.tagID
	) AS Cat_Tag_Bridge_TagsAssociations
    
    ---------
    
    // Returning all tags associated to a stamp which is within a category (Modified part 3).
	SELECT * FROM (
		SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel
			FROM Stamps_Categories_Tags_Bridge
			INNER JOIN Tags
				ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID
				WHERE Stamps_Categories_Tags_Bridge.stampID = 3 AND Stamps_Categories_Tags_Bridge.catID = 2
	) AS Stamp_Cat_TagBridgeAssociations; 
    
    
    --------
    
    // Returning all most viewed stamps.
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
        ORDER BY Stamps.views DESC, Stamps.thumbsUpCount DESC;
        
	-------

    // Returning an artifact and associated stamps, categories, and tags (Part 1) by artifactID.
	SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		WHERE Artifacts.artifactID = 1
        ORDER BY Stamps.views DESC, Stamps.thumbsUpCount DESC;		
    
    -------
    
    // Returning a list of stamps where isFlagged = 1 (or true).
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		WHERE `isFlagged` = 1
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
	-------
    
    // Returning a stamp by ID and associated categories, tag, and user data (e.g. hasThumbUp, hasThumbDown).
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged,
            Sessions.stampID AS SessionsStampID, Sessions.lastAccessedDate, Sessions.duration, Sessions.hasThumbUp, Sessions.hasThumbDown
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		LEFT JOIN `Sessions`
			ON Artifacts.userID = Sessions.userID AND Stamps.stampID = Sessions.stampID
		WHERE Stamps.stampID = 7 AND Artifacts.userID = 1
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
	// Returning a stamp by ID and associated categories, tag, and user data (e.g. hasThumbUp, hasThumbDown).
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged,
            Sessions.stampID AS SessionsStampID, Sessions.lastAccessedDate, Sessions.duration, Sessions.hasThumbUp, Sessions.hasThumbDown
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		LEFT JOIN `Sessions`
			ON Stamps.stampID = Sessions.stampID
		WHERE Sessions.stampID = 7 AND Sessions.userID = 1
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
        
	// Includes Parts 2 & 3 for connecting related categories and tags.
    
    -------
    
    // Testing .MP4 and Link searching.
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		WHERE `title` LIKE '%Pythagorean Theorem%' AND (Artifacts.formatType LIKE '.MP4' OR Artifacts.formatType LIKE 'Link')
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;

		// WHERE `title` LIKE '%Pythagorean Theorem%' AND (Artifacts.formatType='.MP4' OR Artifacts.formatType='Link')
        
	-------
    
    // Correlated searches (phase 2) that inspects categories of exact result set and returns their stamps (which may be related to user search query).
    
    -------
    
    // Testing listCorrelatedArtifactInfoMatchingSearchFormQuery(), which is a backend API function that returns a list of correlated artifacts and associated stamps based on user search query (correlated search phase 2).
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged 
		FROM Artifacts 
        LEFT JOIN Stamps 
			ON Artifacts.artifactID = Stamps.artifactID 
		WHERE Artifacts.title LIKE '%Pythagorean%' OR Artifacts.title LIKE '%Theorem%' OR Artifacts.formatType LIKE '%.MP4%' 
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
	-------
    
    // Returns most liked stamps (Part 1).
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged 
		FROM Artifacts 
        LEFT JOIN Stamps 
			ON Artifacts.artifactID = Stamps.artifactID 
		ORDER BY Stamps.thumbsUpCount DESC, Stamps.views DESC;
        
	-------
    
    // Returning all categories' tags (was part of part 3 logic).
    SELECT catID, catLabel, tagID, tagLabel FROM (
		SELECT * FROM (
			SELECT Categories.catID, Categories.catLabel, Categories_Tags_Bridge.tagID AS TagIDFromBridge FROM Categories
				INNER JOIN Categories_Tags_Bridge
					ON Categories.catID = Categories_Tags_Bridge.catID
					WHERE Categories.catID = 21
		) AS Cat_Tag_BridgeAssociations 
			INNER JOIN Tags
				ON Cat_Tag_BridgeAssociations.TagIDFromBridge = Tags.tagID
	) AS Cat_Tag_Bridge_TagsAssociations
    
    
    -------
    
    // Returns a list of artifacts and associated stamps (Part 1) with joins to categories and tags fields.
    SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged,
            Categories.catID, Categories.catLabel, Tags.tagID, Tags.tagLabel
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		LEFT JOIN `Stamps_Categories_Tags_Bridge`
			ON Stamps.stampID = Stamps_Categories_Tags_Bridge.stampID
		LEFT JOIN `Categories`
			ON Stamps_Categories_Tags_Bridge.catID = Categories.catID
		LEFT JOIN `Tags`
			ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID
		WHERE `title` LIKE '%Basic trigonometry%'
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
	SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged,
            Categories.catID, Categories.catLabel, Tags.tagID, Tags.tagLabel
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		LEFT JOIN `Stamps_Categories_Tags_Bridge`
			ON Stamps.stampID = Stamps_Categories_Tags_Bridge.stampID
		LEFT JOIN `Categories`
			ON Stamps_Categories_Tags_Bridge.catID = Categories.catID
		LEFT JOIN `Tags`
			ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID
		WHERE `catLabel` LIKE '%Trigonometry%'
        GROUP BY Stamps.stampID
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
        
	SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
			Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged,
            Categories.catID, Categories.catLabel, Tags.tagID, Tags.tagLabel
		FROM `Artifacts` 
		LEFT JOIN `Stamps` 
			ON Artifacts.artifactID = Stamps.artifactID 
		LEFT JOIN `Stamps_Categories_Tags_Bridge`
			ON Stamps.stampID = Stamps_Categories_Tags_Bridge.stampID
		LEFT JOIN `Categories`
			ON Stamps_Categories_Tags_Bridge.catID = Categories.catID
		LEFT JOIN `Tags`
			ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID
		WHERE `catLabel` LIKE '%Trigonometry%' AND `tagLabel` LIKE '%Assignment 12%' OR `tagLabel` LIKE '%Problem 2%'
        ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;
	
        
        
        
    
        
	
            
	
    
        

*/



/* Temporary Table that builds a resultSet (legacy)*/
/*
CREATE TABLE IF NOT EXISTS ResultSetTemp (
	rowIndex INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	artifactID INT UNSIGNED NOT NULL,
    userID INT UNSIGNED NOT NULL,
    title NVARCHAR(255) NOT NULL,
    descr NVARCHAR(250000) NOT NULL,
    author NVARCHAR(255) NOT NULL,
    formatType ENUM('Link', '.MP3', '.MP4', '.TXT', '.PDF', '.DOCX', '.PNG', 'OTHER') NOT NULL,
    location NVARCHAR(500) NOT NULL,

	stampID INT UNSIGNED,
    aTimestamp TIME,
    pageNumber INT UNSIGNED,
    sectionPercentage INT,
    shortName NVARCHAR(100) NOT NULL,
    views INT,
    thumbsUpCount INT,
    thumbsDownCount INT,
    isFlagged BOOL
);
-- DESCRIBE ResultSetTemp;
-- DROP TABLE ResultSetTemp;
-- SELECT * FROM ResultSetTemp;
-- SELECT * FROM ResultSetTemp
	-- ORDER BY artifactID ASC;
-- DELETE FROM ResultSetTemp;
*/
/*


INSERT INTO ResultSetTemp (artifactID, userID, title, descr, author, formatType, location, stampID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) 
	VALUES (1, 1, 'Pythagorean Theorem', 'YouTube Video Test', 'Khan Academy', 'Link', 'https://www.youtube.com/embed/AA6RfgP-AHU?start=356', 3, '00:05:53', NULL, NULL, '', 0, 0, 0, 0);


*/




    

