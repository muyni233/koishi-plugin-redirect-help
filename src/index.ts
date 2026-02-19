import { Context, Schema } from 'koishi'

export const name = 'help-redirect'

export interface Config {
  targetCommand: string
}

export const Config: Schema<Config> = Schema.object({
  targetCommand: Schema.string()
    .default('status') // 默认重定向到 status 指令，你可以改成 menu 或其他
    .description('当 /help 不带参数时，重定向到的目标指令。'),
})

export function apply(ctx: Context, config: Config) {
  // 监听指令执行前的事件
  ctx.before('command/execute', async (argv) => {
    // 1. 判断当前尝试执行的指令是否名为 'help'
    if (argv.command.name === 'help') {
      
      // 2. 判断是否有参数 (args) 或 选项 (options)
      // argv.args 是位置参数列表，例如 /help echo 中的 ['echo']
      // argv.options 是选项，例如 /help -a 中的 { a: true }
      const hasArgs = argv.args.length > 0
      const hasOptions = Object.keys(argv.options || {}).length > 0

      // 3. 如果既没有参数也没有选项（即纯粹的 /help）
      if (!hasArgs && !hasOptions) {
        // 执行目标指令 (config.targetCommand)
        // 使用 session.execute 来模拟用户输入了另一个指令
        return argv.session.execute(config.targetCommand)
      }
    }
    // 如果有参数，什么都不做，让 Koishi 继续执行原本的 help 逻辑
  })
}