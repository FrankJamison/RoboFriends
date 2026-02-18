const stripLegacyHacks = () => {
    return {
        postcssPlugin: 'strip-legacy-css-hacks',
        Declaration(decl) {
            const prop = decl.prop;
            if (typeof prop === 'string' && (prop.startsWith('*') || prop.startsWith('_'))) {
                decl.remove();
            }
        },
    };
};
stripLegacyHacks.postcss = true;

const addStandardAppearance = () => {
    return {
        postcssPlugin: 'add-standard-appearance',
        Declaration(decl) {
            if (decl.prop !== '-webkit-appearance' && decl.prop !== '-moz-appearance') return;

            const parent = decl.parent;
            if (!parent || !parent.nodes) return;

            const alreadyHasAppearance = parent.nodes.some(
                (n) => n.type === 'decl' && n.prop === 'appearance',
            );
            if (alreadyHasAppearance) return;

            decl.cloneAfter({ prop: 'appearance' });
        },
    };
};
addStandardAppearance.postcss = true;

module.exports = {
    plugins: [stripLegacyHacks(), addStandardAppearance()],
};
