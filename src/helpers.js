exports.removeTrailingSlash = path => {
    return path === '/' ? path : path.replace(/\/$/, '')
}
