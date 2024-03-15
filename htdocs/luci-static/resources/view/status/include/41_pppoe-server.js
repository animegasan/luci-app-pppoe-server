/* This is free software, licensed under the Apache License, Version 2.0
 *
 * Copyright (C) 2024 Hilman Maulana <hilman0.0maulana@gmail.com>
 */

'use strict';
'require view';
'require fs';

return view.extend({
	title: _('Active PPPoE Client'),
	handleSaveApply: null,
	handleSave: null,
	handleReset: null,
	load: function() {
		let location = '/var/etc/pppoe-server/session/';
		return fs.list(location).then(function(files) {
			return Promise.all(files.map(function(file) {
				return fs.read(location + file.name).then(function(content) {
					return JSON.parse(content);
				}).catch(function(error) {
					console.error("Error while reading file " + file.name + ":", error);
				});
			}));
		}).catch(function(error) {
			console.error("Error while listing files:", error);
		});
	},
	render: function(data) {
		var pppoeList = data || [];

		var pppoeRows;
		if (pppoeList.length === 0) {
			pppoeRows = [
				E('tr', { 'class': 'tr placeholder' }, [
					E('td', {'class': 'td'}, [
						E('em', _('There are no active pppoe client'))
					])
				])
			];
		} else {
			pppoeRows = pppoeList.map(function (pppoe, index) {
				var rowClass = index % 2 === 0 ? 'cbi-rowstyle-1' : 'cbi-rowstyle-2';
				return E('tr', { 'class': 'tr ' + rowClass }, [
					E('td', {'class': 'td'}, pppoe.username),
					E('td', {'class': 'td'}, pppoe.interface),
					E('td', {'class': 'td'}, pppoe.ip),
					E('td', {'class': 'td'}, pppoe.mac),
					E('td', {'class': 'td'}, pppoe.login_time)
				]);
			});
		}

		var pppoeTable = E('table', { 'class': 'table cbi-section-table' }, [
			E('tr', { 'class': 'tr table-titles' }, [
				E('th', {'class': 'th'}, _('Username')),
				E('th', {'class': 'th'}, _('Interface')),
				E('th', {'class': 'th'}, _('Client IP')),
				E('th', {'class': 'th'}, _('MAC address')),
				E('th', {'class': 'th'}, _('Login Time'))
			]),
			E(pppoeRows)
		]);

		return pppoeTable;
	}
});
