generate:
	pelican content -s pelicanconf.py
	rm -rf output/pages/blog.html
	mv output/index.html output/pages/blog.html
	mv output/pages/index.html output/

publish:
	# push the output folder into the local gh-pages branch
	ghp-import output -b master
	git push origin master

	# push local content to the remote
	# git push origin gh-pages
