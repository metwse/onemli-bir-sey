const d = document, defaultAlert = alert

const main = d.querySelector('main'), message = d.querySelector('div#message')

const utb = str => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)))
const btu = b64 => decodeURIComponent(atob(b64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))

if (location.pathname.substring(1)) {
	main.style.display = 'none'
	message.querySelector('.title').innerText = `OHA ${decodeURIComponent(location.pathname.substring(1)).toLocaleUpperCase()}, MESAJ!`
	message.querySelector('.content').innerText = btu(location.search.substring(1))
	message.querySelector('button').onclick = () => {
		message.style.display = 'none', main.style.display = 'block'
		history.pushState({}, '/', '/')
	}
} else message.style.display = 'none'

const form = d.querySelector('form')
form.onsubmit = async e => {
	e.preventDefault(), e.submitter.blur()
	if (!form.message.value) return messagebox('OHA', 'boş<wbr>MESAJ<wbr>'.repeat(30), 'özür', '')
	if (!form.name.value) return messagebox('OHA', 'ad<wbr>YOK<wbr>'.repeat(30), 'özür', '')
	link = `https://önemlibişey.metw.cc/${encodeURIComponent(form.name.value)}?${utb(form.message.value)}`
	if (await messagebox('başarılı', `Bağlantı oluşturuldu. <code>${link}</code>Alternatif bağlantı: <code>https://onemlibisey.metw.cc/${encodeURIComponent(form.name.value)}?${utb(form.message.value)}</code>`, 'paylaş', 'iptal')) navigator.share({ text: `${form.name.value}! BAKKK, ${link}` })
}

const messagebox = async (title, content, ok, cancel) => {
	return await new Promise(resolve => {
		var e = messagebox.div
		e.querySelector('.title').innerHTML = title
		e.querySelector('.content').innerHTML = content
		e.querySelector('.ok').innerHTML = ok
		e.querySelector('.cancel').innerHTML = cancel
		e.style.display = 'grid'
		setTimeout(() => e.style = 'display: grid; opacity: 1; transform: none', 20)
		var _id = messagebox.id = Math.random()
		messagebox.resolve = state => {
			if (_id != messagebox.id) return
			e.style = 'display: grid'
			setTimeout(() => (_id == messagebox.id) && (e.style = ''), 320)
			resolve(state)
		}
	})
}
messagebox.div = d.getElementById('messagebox')
messagebox.div.querySelector('.ok').onclick = () => messagebox.resolve(true)
messagebox.div.querySelector('.cancel').onclick = () => messagebox.resolve(false)
addEventListener('keypress', ({ key }) => {
	switch (key) {
		case 'Enter': messagebox.resolve(true); break
		case 'Escape': messagebox.resolve(false); break
	}
})
