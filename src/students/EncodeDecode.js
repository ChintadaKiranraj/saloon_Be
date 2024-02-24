function base64Converter(object){
    let jsonObject = JSON.stringify(object);
    let base64ConvertValue = Buffer.from(jsonObject).toString("base64");
    console.log(base64ConvertValue);
    return base64ConvertValue;
}

function base64ToJson(base64String){
    const convertJson = Buffer.from(base64String, "base64").toString();
    return JSON.parse(convertJson);
}

module.exports = {
    base64Converter,
    base64ToJson,
}