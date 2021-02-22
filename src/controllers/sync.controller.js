var syncUsers = {};

exports.syncOn = function(id) {
    syncUsers[id] = true;
}

exports.syncOff = function(id) {
    syncUsers[id] = false;
}

exports.appsync = function (req, res) {
    const id = Number(req.params.id);
    if(id){
        if(syncUsers[id] == undefined) {
            syncUsers[id] = false;
        } else if (syncUsers[id]){
            syncUsers[id] = false;
            return res.json({update: true});
        }
        return res.json({update: false});
    }
    return res.json({response : 'Error'});
};