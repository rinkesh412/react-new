const CommonUtils = {

    intersectStr: (arrStr, toArrStr) => {
        for (let r of arrStr) {
            const rl = r.trim().toLowerCase();
            for (let t of toArrStr) {
                if (rl === t.trim().toLowerCase())
                    return true;
            }
        }
        return false;
    },

    getLocaleText: map => {
        const lang  = navigator.language.substr(0, 2);
        const text = map[lang];
        return text || map['en'];
    }
};

export default CommonUtils;