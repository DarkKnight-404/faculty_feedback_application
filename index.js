const express = require('express');
const app = express();
const mysql = require('mysql2');
require('dotenv').config();




const ca = `
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
`




app.use(express.text());

let port = 3001;

// MySQL Database Connection
let connection = mysql.createConnection({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    user: '2ALCrVvP4zHSppn.root',
    password: '8c7uLPnRXq3wDMO0',
    database: 'faculty_feedback',
    port: '4000',
    ssl: {
        ca: ca
    }

});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

// Serve static files (CSS, JS) from the "public" folder
app.use(express.static('public'));

// Route to send the faculty data as JSON
app.get('/faculty', (req, res) => {

    connection.query('SELECT * FROM faculty', (err, results) => {
        if (err) {
            console.log("got error in sql fetching")
            console.log(JSON.stringify(err));
            console.log("trying to reconnect to database tidb cloud cluster 0 ");
            connection = mysql.createConnection({
                host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
                user: '2ALCrVvP4zHSppn.root',
                password: '8c7uLPnRXq3wDMO0',
                database: 'faculty_feedback',
                port: '4000',
                ssl: {
                    ca: ca
                }

            });
            connection.connect((err2) => {
                if (err2) {
                    console.error('Error connecting to the database: ' + err2);
                    res.status(500).json({ error: 'request cant be resolved ', err: err });
                }else{
                    console.log("tidb servver reconnected refresh");
                }
            });
        } else {
            res.json(results);  // Send data as JSON
        }
    });
});

// Route to send the faculty data as JSON
app.get('/reviewData', (req, res) => {
    console.log("got review data req")
    connection.query('SELECT * FROM feedback', (err, results) => {
        if (err) {
            console.log("got error in sql fetching")
            console.log(JSON.stringify(err));
            console.log("trying to reconnect to database tidb cloud cluster 0 ");
            connection = mysql.createConnection({
                host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
                user: '2ALCrVvP4zHSppn.root',
                password: '8c7uLPnRXq3wDMO0',
                database: 'faculty_feedback',
                port: '4000',
                ssl: {
                    ca: ca
                }

            });
            connection.connect((err2) => {
                if (err2) {
                    console.error('Error connecting to the database: ' + err2);
                    res.status(500).json({ error: 'request cant be resolved ', err: err });
                }else{
                    console.log("tidb servver reconnected refresh");
                }
            });
        } else {
            res.json(results);  // Send data as JSON
        }
    });
});

// rating data
app.get('/ratingdata', (req, res) => {
    console.log("sending rating data");
    connection.query('select facultyName,avg(rating) as avgRating,count(*) as ratingCount from feedback group by facultyName', (err, results) => {
        if (err) {
            console.log("got error in sql fetching")
            console.log(JSON.stringify(err));
            console.log("trying to reconnect to database tidb cloud cluster 0 ");
            connection = mysql.createConnection({
                host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
                user: '2ALCrVvP4zHSppn.root',
                password: '8c7uLPnRXq3wDMO0',
                database: 'faculty_feedback',
                port: '4000',
                ssl: {
                    ca: ca
                }

            });
            connection.connect((err2) => {
                if (err2) {
                    console.error('Error connecting to the database: ' + err2);
                    res.status(500).json({ error: 'request cant be resolved ', err: err });
                }else{
                    console.log("tidb servver reconnected refresh");
                }
            });
        } else {
            res.json(results);  // Send data as JSON
        }
    });
});

app.post("/submitfeedback", (req, resp) => {
    console.log(req.body);

    let data = JSON.parse(req.body);

    connection.query(`insert into feedback (facultyName, feedback, rating) values ("${data.faculty}","${data.comments}",${data.rating})`, (err, res) => {
        if (err) {
            console.log("got error in sql fetching")
            console.log(JSON.stringify(err));
            console.log("trying to reconnect to database tidb cloud cluster 0 ");
            connection = mysql.createConnection({
                host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
                user: '2ALCrVvP4zHSppn.root',
                password: '8c7uLPnRXq3wDMO0',
                database: 'faculty_feedback',
                port: '4000',
                ssl: {
                    ca: ca
                }

            });
            connection.connect((err2) => {
                if (err2) {
                    console.error('Error connecting to the database: ' + err2);
                    res.status(500).json({ error: 'request cant be resolved ', err: err });
                }else{
                    console.log("tidb servver reconnected refresh");
                }
            });
        } else {
            console.log(res)
            resp.send({ status: true })
        }
    })
})

app.post("/removeFaculty", (req, res) => {
    console.log(req.body);

    let data = JSON.parse(req.body);
    const name = data.name;
    console.log(name);

    connection.query(`delete from faculty where name = "${name}";`, (err, res) => {
        if (err) {
            console.log("got error in sql fetching")
            console.log(JSON.stringify(err));
            console.log("trying to reconnect to database tidb cloud cluster 0 ");
            connection = mysql.createConnection({
                host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
                user: '2ALCrVvP4zHSppn.root',
                password: '8c7uLPnRXq3wDMO0',
                database: 'faculty_feedback',
                port: '4000',
                ssl: {
                    ca: ca
                }

            });
            connection.connect((err2) => {
                if (err2) {
                    console.error('Error connecting to the database: ' + err2);
                    res.status(500).json({ error: 'request cant be resolved ', err: err });
                }else{
                    console.log("tidb servver reconnected refresh");
                }
            });
        } else {
            console.log(res)
        }
    })
    connection.query(`delete from feedback where facultyName = "${name}";`, (err, res) => {
        if (err) {
            console.log("got error in sql fetching")
            console.log(JSON.stringify(err));
            console.log("trying to reconnect to database tidb cloud cluster 0 ");
            connection = mysql.createConnection({
                host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
                user: '2ALCrVvP4zHSppn.root',
                password: '8c7uLPnRXq3wDMO0',
                database: 'faculty_feedback',
                port: '4000',
                ssl: {
                    ca: ca
                }

            });
            connection.connect((err2) => {
                if (err2) {
                    console.error('Error connecting to the database: ' + err2);
                    res.status(500).json({ error: 'request cant be resolved ', err: err });
                }else{
                    console.log("tidb servver reconnected refresh");
                }
            });
        } else {
            console.log(res)
        }
    })
})

app.post("/addfaculty", (req, res) => {
    console.log(req.body);

    let {
        name,
        department,
        email,
        subjects,
        profile_pic
    } = JSON.parse(req.body);


    connection.query(`INSERT INTO faculty (name, department, email, subjects, profile_pic, rating, feedback_count)
VALUES ('${name}', '${department}', '${email}', '${subjects}', '${profile_pic}', 0, 0);
`, (err, resp) => {
        if (err) {
            console.log("got error in sql fetching")
            console.log(JSON.stringify(err));
            console.log("trying to reconnect to database tidb cloud cluster 0 ");
            connection = mysql.createConnection({
                host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
                user: '2ALCrVvP4zHSppn.root',
                password: '8c7uLPnRXq3wDMO0',
                database: 'faculty_feedback',
                port: '4000',
                ssl: {
                    ca: ca
                }

            });
            connection.connect((err2) => {
                if (err2) {
                    console.error('Error connecting to the database: ' + err2);
                    res.status(500).json({ error: 'request cant be resolved ', err: err });
                }else{
                    console.log("tidb servver reconnected refresh");
                }
            });
        } else {
            console.log(resp)
            res.send({ status: "success" })
        }
    })

})

app.listen(process.env.PORT || 3002, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT || port}`);
});
