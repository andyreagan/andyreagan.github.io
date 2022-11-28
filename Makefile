generate:
	python3 -m pelican content -s pelicanconf.py
	rm -rf output/pages/blog.html
	mv output/index.html output/pages/blog.html
	mv output/pages/index.html output/

math19:
	pandoc --from=markdown --to=html content/teaching/2015-09-uvm-math019/index.markdownskip > content/teaching/2015-09-uvm-math019/index.html
	mkdir -p content/teaching/2015-09-uvm-math019/common/notes
	cp ~/teaching/2015-09-uvm-math019/common/syllabus.pdf content/teaching/2015-09-uvm-math019/common
	cp ~/teaching/2015-09-uvm-math019/common/notes/{Math019_ch6.pdf,Math019_ch5.pdf,Math019_ch4_2_5.pdf,Math019_ch3_4_5.pdf,Math019_ch3_1_3.pdf,Math019_ch2.pdf,Math019_ch1.pdf} content/teaching/2015-09-uvm-math019/common/notes

sds291:
	cp ~/teaching/2018-09-smith-sds291/mth291-s15/www/{index,resources,schedule,syllabus}.html content/teaching/2018-09-smith-SDS-291
	# also copy over relevant hw, etc, from the teaching directory

papers:
	python3 ~/websites/complex-systems-database/tools/cmplxsys_press_and_papers_templates.py andyreagan content/images/papers paper_list_template_markdown content/pages/publications.markdown
