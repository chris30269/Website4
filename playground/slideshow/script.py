import os


f = open("slides.xml", "w")
f.write("<?xml version='1.0'?><slides>")
for filename in os.listdir("H:\public_html\website4\playground\slideshow\content"):
   	print  filename
	base, extension = os.path.splitext(filename)
	print extension
	if extension == ".PNG" or extension == ".JPG" or extension == ".GIF" or extension == ".png" or extension == ".jpg" or extension == ".gif" or extension == ".jpeg" or extension == ".JPEG":
		f.write("<slide>")
		f.write(filename)
		f.write("</slide>")
f.write("</slides>")
f.close()