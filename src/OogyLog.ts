const kOogyIsDebug = true;

type OogyLogType = (msg: string, ...args: any[]) => void;

/**
 * Internal debug log for Oogy game; currently uses console.log but is meant to use a more sophisticated logging system when available.
 * @param msg Any string message to use as first param
 * @param args Indeterminely long list of arguments to pass to console.log
 */
let oogyLog: OogyLogType, oogyErrorLog: OogyLogType, oogyWarnLog: OogyLogType;

const kOogyLogFontSize = "8px";

// if (kOogyIsDebug) {
// window.debug = window.console.log.bind(window.console, '%s: %s');

oogyLog = (msg, ...args) => {
  try {
    throw new Error("OogyLogError");
  } catch (e) {
    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #9BACF1;`;

    const callee = e.stack.split("\n")[2].trim();
    console.log(
      `%c${msg}\n> ${new Date().toISOString()} ${callee}`,
      oogyLogCSS,
      ...args
    );
  }
};

oogyErrorLog = (msg, ...args) => {
  try {
    throw new Error("OogyLogError");
  } catch (e) {
    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: tomato;`;

    const callee = e.stack.split("\n")[2].trim();
    console.error(
      `%c${msg}\n> ${new Date().toISOString()} ${callee}`,
      oogyLogCSS,
      ...args
    );
  }
};

oogyWarnLog = (msg, ...args) => {
  try {
    throw new Error("OogyLogError");
  } catch (e) {
    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: goldenrod;`;

    const callee = e.stack.split("\n")[2].trim();
    console.warn(
      `%c${msg}\n> ${new Date().toISOString()} ${callee}`,
      oogyLogCSS,
      ...args
    );
  }
};

// } else {
//     oogyLog = () => { };
//     oogyErrorLog = () => { };
//     oogyWarnLog = () => { };
// }

export { kOogyIsDebug, oogyLog, oogyErrorLog, oogyWarnLog };
