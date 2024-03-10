import chalk from 'chalk'
import { PKG_NAME, UNICODE } from '../utils/constant'

const { green, blue, yellow, red } = chalk;

export default {
  success: (msg: string) => {
    console.log(green(msg))
  },
  info(text: string) {
    console.info(blue(text));
  },
  warn(text: string) {
    console.info(yellow(text));
  },
  error(text: string) {
    console.error(red(text));
  },
  result(text: string, pass: boolean) {
    console.info(
      blue(`[${PKG_NAME}] ${text}`),
      pass ? green(UNICODE.success) : red(UNICODE.failure),
    );
  },
}