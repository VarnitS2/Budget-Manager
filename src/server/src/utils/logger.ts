/**
 * A simple logger class to pretty print messages to the console.
 */
export class Logger {
  DB_LOG_PREFIX: string = "[db]";
  FG_RED: string = "\x1b[31m";
  FG_GREEN: string = "\x1b[32m";
  FG_RESET: string = "\x1b[0m";

  /**
   * Pretty print a success message to the console.
   * @param message The message to log
   */
  success(message: string): void {
    console.log(`${this.FG_GREEN}${this.DB_LOG_PREFIX} ${message}${this.FG_RESET}`);
  }

  /**
   * Pretty print an error message to the console.
   * @param message The message to log
   */
  error(message: string): void {
    console.error(`${this.FG_RED}${this.DB_LOG_PREFIX} ${message}${this.FG_RESET}`);
  }
}
