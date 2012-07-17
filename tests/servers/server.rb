require "rack"
require "json"
require "active_support/core_ext/hash/conversions"

class HelloWorld
  def call(env)
    req = Rack::Request.new(env)
    puts req.params
    return [200, {"Content-Type" => "application/json"}, [env.to_json]]
  end
end

Rack::Server.start app:HelloWorld.new, Port:3000, server:"webrick"