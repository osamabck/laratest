<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="token" content={{ csrf_token() }}>
    @vite('resources/js/main.jsx')
    @inertiaHead
  </head>
  <body>
    @inertia
  </body>
</html>
