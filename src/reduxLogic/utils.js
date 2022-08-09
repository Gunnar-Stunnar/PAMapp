export const parseSetting = (item) => {
    let setting: Setting = {}

    setting = {
        type: item["type"],
        description: item["description"],
        value: item["currentVal"],
        isDevice: item["isDevice"],
        id: item["id"],
        subSettings: {},
        options: []
    }
    
    if (item["type"] == "menu") {
        for (var i = 0; i < item["items"].length; i++) {
            setting["subSettings"][item["items"][i]["id"]] = parseSetting(item["items"][i]);
        }
    }
    else if (item["type"] == "options") {
        setting["options"] = item["items"];
    }

    return setting;
}

export const parseMessage = (message, updatedDevice) => {
    
    if (updatedDevice["ID"] == null) {
        updatedDevice["ID"] = Number(message["device"]);
    }

    if (message["status"] == 404) {
        console.log(message["error"])
    }
    else {
        if (message["type"] == "measurements") {
            updatedDevice["batteryLevel"] = message["battery"];
            for (var i = 0; i < message["body"].length; i++) {
                let packetNum = 0;
                let item = message["body"][i];
                console.log(item, i) ;
                console.log(updatedDevice);
                if (updatedDevice.Species[item["name"]] == null) {
                    // TODO: check if any of the species info needs updating?
                    updatedDevice.Species[item["name"]] = {species: {name: item["name"], units: item["units"]}, packets: []};
                }
                else {
                    packetNum = updatedDevice.Species[item["name"]].packets.length;
                }
                if (item["value"] !== "N/A") {
                    updatedDevice.Species[item["name"]].packets.push({
                        units: item["units"],
                        value: Number(item["value"]),
                        packetNum: packetNum,
                        dateTime: new Date(),
                        location: {
                            latitude: message["location"]["latitude"],
                            longitude: message["location"]["longitude"]
                        }
                    })
                }
                // console.log(updatedDevice.Species[item["name"]].packets)
            }
        }
        else if (message["type"] == "settings") {
            for (var i = 0; i < message["body"].length; i++) {
                let item = message["body"][i];
                console.log(item);
                updatedDevice.settings[item["id"]] = parseSetting(item)
                // console.log(updatedDevice.settings[item["id"]])
            }
        }
    }
}
