tps = 0
port = 9296
ticks_time = 0
ticks = 0

function onTick(game_ticks)
	calculateTPS()
	if ticks % 30 == 0 then
		server.httpGet(port, "/data?playercount="..#server.getPlayers()-1 .."&tps="..tps)
	end
end

function calculateTPS()
    ticks = ticks + 1
    if server.getTimeMillisec() - ticks_time >= 500 then
        tps = ticks*2
        ticks = 0
        ticks_time = server.getTimeMillisec()
    end
end