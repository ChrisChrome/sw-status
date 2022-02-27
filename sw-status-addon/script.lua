tps = 0
port = 9296
ticks_time = 0
ticks = 0
first_response = false

function onTick(game_ticks)
	ticks = ticks + 1
    if server.getTimeMillisec() - ticks_time >= 500 then
        tps = ticks*2
        ticks = 0
        ticks_time = server.getTimeMillisec()
    end
	if server.getTimeMillisec() % 500 == 0 and first_response == false then
		server.httpGet(port, "/data?playercount="..#server.getPlayers()-1 .."&tps="..tps)
	end
end

function httpReply(r_port, r_url, r_response_body)
	if r_port == port then
		if first_response == false and r_response_body == "OK" then
			first_response = true
		end
		server.httpGet(port, "/data?playercount="..#server.getPlayers()-1 .."&tps="..tps)
	end
end