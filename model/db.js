#!/usr/bin/env node
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./data/doanddone');

function find(response, table) {
    var data = '';
    db.get('SELECT * FROM ' + table,
    function (err, row) {
        if (err) throw err;
        var h = JSON.stringify(row);

        data += h;
        response.end(data);
    });
    return;
}
function findAllAvailableUsers(response,user) {
    var data = '';
    var query = "SELECT username FROM tuser WHERE username != @user";

    db.all(query, user,
        function (err, rows) {
            if (err) throw err;
            response.end(JSON.stringify(rows));});
    return;
}
function findAllGroups(response,user) {
    var data = '';
    var query = "SELECT groupname FROM tgroup AS g INNER JOIN tgroupmanagement AS m ON g.groupid = m.groupid" +
                " WHERE m.username=@user";

    db.all(query, user,
        function (err, rows) {
            if (err) throw err;
            response.end(JSON.stringify(rows));});
    return;
}
function addGroup(response, post)
{

    db.get('SELECT MAX(groupid) AS gid FROM tgroup',
        function (err, row) {
            var gid = row.gid+1;
            var insertGroup = "INSERT INTO tgroup (groupname, createdOn, modifiedBy) VALUES (" +
                "?, DATETIME('now'), ?);";
            var insertGroupManagement = "INSERT INTO tgroupmanagement (username, groupid, isActiveUser) VALUES (" +
                "?, ?, 1);";
            var users = post['users[]'];
            db.run("BEGIN TRANSACTION");
            db.run(insertGroup,post['groupname'],post['createdby'] );
            db.run(insertGroupManagement,post['createdby'],gid );
            if(typeof users == 'string')
            {
                db.run(insertGroupManagement,users,gid );
                console.log(users);
            }
            else
            {
                for(var i = 0; i< users.length;i++)
                {
                    db.run(insertGroupManagement,users[i],gid );
                    console.log(users[i]);
                }
            }
            db.run("END");
            response.end();
            return;
        });

    return;
}
module.exports.find = find;
module.exports.findAllGroups = findAllGroups;
module.exports.findAllAvailableUsers = findAllAvailableUsers;
module.exports.addGroup = addGroup;