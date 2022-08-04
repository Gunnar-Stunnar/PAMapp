type Setting = {
    type: String,
    description: String,
    value: String,
    isDevice: Boolean,
    id: String,
    subSettings: { [key: String] : Setting }, // how to deal with sub settings for UI?
    options: String[]
}