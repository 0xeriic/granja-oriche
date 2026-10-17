(function () {
  var ESC = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var defs = [
    { id: 'docena', name: 'Docena campera', desc: '12 huevos recién recogidos. La caja de siempre para la semana.', eggs: 12, unit: '/ docena', tag: '' },
    { id: 'dos', name: 'Caja familiar', desc: '24 huevos para desayunos largos, tortillas y repostería.', eggs: 24, unit: '/ 2 docenas', tag: '' },
    { id: 'semana', name: 'Cada semana', desc: 'Una docena en tu puerta cada semana, sin tener que acordarte.', eggs: 12, unit: '/ semana', tag: 'Suscripción' }
  ];
  var zdefs = [
    { id: 'zaragoza', label: 'Reparto en Zaragoza', sub: 'Te lo llevamos a casa, en mano.' },
    { id: 'teruel', label: 'Reparto en Teruel', sub: 'Te lo llevamos a casa, en mano.' },
    { id: 'recogida', label: 'Recoger en tienda', sub: 'Calamocha, Daroca o Mercado Paseo Teruel.' }
  ];
  var q = { docena: 1, dos: 0, semana: 0 };
  var zone = 'zaragoza';
  var box = '<svg aria-hidden="true" width="150" height="74" viewBox="0 0 150 74"><rect x="4" y="30" width="142" height="40" rx="8" fill="#C9B48A"></rect><ellipse cx="28" cy="30" rx="13" ry="17" fill="#F2E3C6"></ellipse><ellipse cx="57" cy="28" rx="13" ry="17" fill="#E9CFA3"></ellipse><ellipse cx="86" cy="30" rx="13" ry="17" fill="#F2E3C6"></ellipse><ellipse cx="115" cy="28" rx="13" ry="17" fill="#E9CFA3"></ellipse><rect x="4" y="38" width="142" height="32" rx="8" fill="#B79F70"></rect><text x="75" y="60" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-size="13" font-weight="800" fill="#FBFAF5">ORICHE</text></svg>';
  var minus = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"></path></svg>';
  var plus = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>';
  var btn = 'width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;';

  function render() {
    document.getElementById('productos').innerHTML = defs.map(function (d) {
      var n = q[d.id];
      return '<article style="background:#fff;border:2px solid ' + (n > 0 ? '#1E3A2A' : '#D5DDCB') + ';border-radius:24px;padding:22px;display:flex;flex-direction:column;gap:14px;position:relative">' +
        (d.tag ? '<span style="position:absolute;top:16px;right:16px;background:#1E3A2A;color:#FBFAF5;font-size:12px;font-weight:700;padding:5px 10px;border-radius:999px">' + d.tag + '</span>' : '') +
        '<div style="height:108px;border-radius:16px;background:#F6F1E1;display:flex;align-items:center;justify-content:center">' + box + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:6px"><h3 style="margin:0;font-family:\'Bricolage Grotesque\',sans-serif;font-size:22px;font-weight:700;color:#1E3A2A">' + d.name + '</h3><p style="margin:0;font-size:15px;line-height:1.5;color:#56625A">' + d.desc + '</p></div>' +
        '<div style="display:flex;align-items:baseline;gap:6px;margin-top:auto"><span style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:26px;font-weight:800;color:#1E3A2A">[PRECIO]</span><span style="font-size:14px;color:#56625A">' + d.unit + '</span></div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;background:#F3F5EF;border-radius:999px;padding:4px">' +
        '<button type="button" class="oc-q" data-id="' + d.id + '" data-d="-1" aria-label="Quitar una ' + d.name + '" style="' + btn + 'background:#fff;color:#1E3A2A">' + minus + '</button>' +
        '<span aria-live="polite" style="font-size:18px;font-weight:700;color:#1E3A2A">' + n + '</span>' +
        '<button type="button" class="oc-q" data-id="' + d.id + '" data-d="1" aria-label="Añadir una ' + d.name + '" style="' + btn + 'background:#1E3A2A;color:#FBFAF5">' + plus + '</button>' +
        '</div></article>';
    }).join('');

    var zoneLabel = '';
    document.getElementById('zonas').innerHTML = zdefs.map(function (z) {
      var on = z.id === zone; if (on) zoneLabel = z.label;
      return '<label style="display:flex;gap:12px;align-items:flex-start;background:' + (on ? '#fff' : '#F6F8F2') + ';border:2px solid ' + (on ? '#1E3A2A' : '#D5DDCB') + ';border-radius:18px;padding:16px;cursor:pointer">' +
        '<input type="radio" name="zona" value="' + z.id + '"' + (on ? ' checked' : '') + ' style="width:20px;height:20px;margin:2px 0 0;accent-color:#1E3A2A">' +
        '<span style="display:flex;flex-direction:column;gap:3px"><span style="font-weight:700;font-size:16px;color:#1E3A2A">' + z.label + '</span><span style="font-size:14px;line-height:1.45;color:#56625A">' + z.sub + '</span></span></label>';
    }).join('');

    var eggs = 0, lines = [], body = [];
    defs.forEach(function (d) { if (q[d.id] > 0) { eggs += q[d.id] * d.eggs; lines.push([d.name, q[d.id]]); body.push('- ' + q[d.id] + ' × ' + d.name); } });
    var r = document.getElementById('resumen');
    if (lines.length) {
      r.innerHTML = '<div style="display:flex;flex-direction:column;gap:12px">' + lines.map(function (l) {
        return '<div style="display:flex;justify-content:space-between;gap:12px;font-size:16px"><span>' + l[0] + '</span><span style="font-weight:700;color:#1E3A2A">× ' + l[1] + '</span></div>';
      }).join('') + '<div style="height:1px;background:#E2E7DC"></div>' +
        '<div style="display:flex;justify-content:space-between;font-size:16px"><span style="color:#56625A">Total</span><span style="font-weight:700;color:#1E3A2A">' + eggs + ' huevos</span></div>' +
        '<div style="display:flex;justify-content:space-between;font-size:16px"><span style="color:#56625A">Entrega</span><span style="font-weight:700;color:#1E3A2A;text-align:right">' + ESC(zoneLabel) + '</span></div></div>';
    } else {
      r.innerHTML = '<p style="margin:0;font-size:16px;color:#56625A;line-height:1.5">Aún no has añadido ninguna caja. Empieza por una docena.</p>';
    }
    var text = 'Hola, Granja Oriche. Quiero hacer este pedido:\n' + body.join('\n') + '\n\nEntrega: ' + zoneLabel + '\nNombre:\nDirección:\nTeléfono:';
    document.getElementById('enviar').href = 'mailto:granjaoriche@gmail.com?subject=' + encodeURIComponent('Pedido de huevos') + '&body=' + encodeURIComponent(text);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.oc-q'); if (!b) return;
    var id = b.getAttribute('data-id');
    q[id] = Math.max(0, Math.min(20, q[id] + Number(b.getAttribute('data-d'))));
    render();
    var again = document.querySelector('.oc-q[data-id="' + id + '"][data-d="' + b.getAttribute('data-d') + '"]'); if (again) again.focus();
  });
  document.addEventListener('change', function (e) {
    if (e.target.name === 'zona') { zone = e.target.value; render(); var r = document.querySelector('input[name="zona"][value="' + zone + '"]'); if (r) r.focus(); }
  });
  render();
})();
